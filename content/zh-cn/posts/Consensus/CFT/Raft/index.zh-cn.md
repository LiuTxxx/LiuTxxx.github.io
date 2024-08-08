---
title: Raft算法详解
date: 2024-07-30T15:46:24+0800
type: posts
description: Raft算法的详细介绍
resources:
  - name: featured-image
    src: 911.jpg
tags:
  - Raft
  - CFT
  - Consensus
  - SMR
categories:
  - 论文笔记
collections:
  - CFT共识
---

{{< admonition abstract >}}
本文基于Ongaro等人 [[1]](#1) 的论文进行编写。
{{< /admonition >}}

## 引言

共识算法可以促使一个机器集群各自维护一串拥有相同顺序与内容的信息或输入，以保证集群中机器的具有状态一致性。Paxos类算法 [[2]](#2) [[3]](#3) 曾主导着共识算法的设计，大量共识算法是基于Paxos实现或受其影响。

但是，Paxos在实现和可理解性上难度较大，因此Ongaro等人发布了一种全新的共识算法：Raft，其具有更好的可理解性并且具有更实用的应用场景，且更易于实现。

Raft使用了一下独特的技术来提高算法的可理解性：**解构**（Raft将功能分解成选主、日志复制以及安全性保障）、**状态空间简化**（Raft减少了不确定性以及机器之间出现不一致的可能性）。Raft和很多现有的算法十分相似（如Viewstamped Replication [[4]](#5) [[5]](#5)），但也有自己独特的特性：

* **强领导人机制**：日志记录只从领导人流向其他机器；
* **选主机制**：Raft使用随机计时器来触发选主超时；
* **成员变动**（重配置）：集群可以在配置改变时继续处理请求。

## Raft共识算法

### 概述

Raft将共识问题解构为3个相对独立的子问题，分别为：

* **选主**: 当前领导人停止运转时选取新的领导人；
* **日志复制**: 领导人接收客户端发来的请求并将其转换为日志同步至集群中其他机器；
* **安全性保障**：Raft需保障以下几个关键安全属性：
  * **选主安全**：在一个任期之中，最多只有一位领导人可以在选举中胜出；
  * **领导人仅可附加性**：领导人不能重写或删除自己的日志记录，只能在尾部附加记录；
  * **日志匹配**：如果有两份日志中的某条记录拥有相同的下标和任期号，那么这两份日志中的此下标往前的所有记录均能匹配；
  * **领导人完整性**：如果一个日志记录在某个任期被提交，那么这条记录应当会在被记录在该任期之后所有任期中的领导人日志中，也就是说，被提交过的记录不应当被此后的领导人覆写；
  * **状态机安全**：如果一个机器已经将日志中某下标的记录中的命令应用于自身状态机，那么其他机器不能将同下标的不同日志记录应用于自身状态机。


#### 复制状态机

![图1](/images/raft-smr.png "图1")

复制状态机通常通过复制日志来实现，如图1所示。每个机器存储相应的日志，日志中包含一连串的命令，供状态机按顺序执行。每份日志都保证彼此命令及其顺序相同，以此来确保各自状态机会执行相同的命令序列并保持状态一致。

保持日志的一致性就需要用上共识算法。共识模块在接收了客户端的命令之后，会将其命令记录在日志中，并保持每一份日志最终保持相同的内容与顺序，即使在出现机器故障的情况下。

#### 变量与存储

TODO...

### Raft基础

Raft有三个主要的角色：**领导人，从者，候选人**

在所有正常运行的情况下，至多会出现一名领导者，其他机器通常为从者或是候选人。

**领导人**负责处理客户端请求，如果客户端请求发送至从者，从者会将该请求转发给领导人处理。当领导人收到客户端请求时，会先记录日志并将通知其他机器记录该日志。**从者**不会主动发送请求，仅在收到请求时回复。**候选人**则是在领导人选举时出现。

Raft将时间段分割为**任期**，使用连续的整数标识，每个任期都从选主开始，如果没有候选人胜出，任期将没有领导人产生并进而结束。

Raft机器使用远程过程调用（**RPC**）进行交流：

* *AppendEntries:* 领导人会发送该请求通知从者添加记录。
* *RequestVote*: 候选人会发送该请求来获取投票。

每个机器会记录当前的任期号***currentTerm***，并将任期号附加在每一条发出的信息上。机器在处理信息时会对比各自的任期号，如果发现请求中包含陈旧的任期号，机器会拒绝该请求。机器在收到更高任期号时会更新自己的任期号，若该机器为领导人或候选人，则会转变为从者。

### 选主机制

Raft使用**心跳**的机制来检测机器活性和触发选主。领导人会定期发送心跳信息（无日志记录的*AppendEntries*）向从者表示自己的活性，如果从者长期没有收到心跳信息（选主计时器超时），则会认为当前没有可用领导人并触发选主。

当从者触发选主时，会将当前任期号加一、转变为候选人、向自己投票并发送*RequestVote*给其他机器，每个机器仅能对同任期号的请求投出一票（投给自己的一票也算），选票先到先得（后续会介绍一些限制），当某个候选人获取超过半数的任期号相同的选票时，则被认为胜出，成为领导人。

候选人将保持其状态直到以下情况发生：

* 候选人赢得选举
* 发现其他的候选人赢得选举
* 一段时间后没有人获取足够选票

#### 候选人胜出

候选人收到足够的合格选票，转变为领导人，开始向其他机器发送心跳信息。

#### 发现其他候选人胜出

候选人收到不低于自己任期号的心跳信息，则确认有新的领导人产生，转变为从者。

#### 无人胜出

一段时间后，无候选人获取足够合格选票，触发选主超时，再次增加其任期号，并重新发送选票请求。如果每个机器的选主计时器相同，则可能出现无人胜出的无限循环，因此采用随机的选主计时器，以确保某个候选人会先触发超时并提前请求选票，避免进入死循环。

![图2](/images/raft-server-state.png "图2")

机器状态转移图如图2所示。

### 日志复制 （TODO）

For a log replication process:

1. The client will first send a request with command to one of the server, which will eventually be redirected to leader.
2. The leader will append this entry to its log, and send *AppendEntries* to other servers, followers will respond to leader when it has append this entry to its log.
3. If entry is safely replicated in majority of the cluster, leader will apply this command to state machine and return to client.

If follower **did not respond**, leader will retry indefinitely even after it has return to client.

![Figure 3](/images/raft-entry.png "Figure 3")

The overview of replicated logs are shown in Figure 3, where entries are listed with index, and each entry include a term number and its command.

An entry is considered to be **committed** once the leader that created the entry has replicated it on a majority of the servers. This also commits all preceding entries in the leader's log, including entries created by previous leaders. The leader keeps track of the highest index it knows to be committed, and it includes that index in future *AppendEntries* (including heartbeats) so that the other servers eventually find out.

Once a follower learns that a log entry is committed, it applies the entry to its local state machine (in log order).

If no rollback attacks happen, Raft should ensures that (Log Matching):

* If two entries in different logs have the same index and term, then they store the same command.
* If two entries in different logs have the same index and term, then the logs are identical in all preceding entries.

Therefore, for higher safety guarentee, when sending an *AppendEntries* to replicate a new entry, the leader includes the index and term of the entry in its log that immediately precedes this entry. If the follower does not find an entry in its log with the same index and term, then it refuses the new entry.

When a new leader is elected, it may occurs that leader and followers have inconsistent logs, in this case, the leader's log shall prevail. To bring a follower's log into consistency with its own, the leader must find the latest log entry where the two logs agree, delete any entries in the follower's log after that point, and send the follower all of the leader's entries after that point.

Leader record this index for every followers in an array *nextIndex[].* When a leader first comes to power, it initializes all *nextIndex* values to the index just after the last log (it will be 9 in Figure 3). If a follower's log is inconsistent with the leader's, the consistency check will fail in the next *AppendEntries*. After a rejection, the leader decrements this follower's *nextIndex* and retries the *AppendEntries*.

### Safety

The previous sections described how Raft elects leaders and replicates log entries. However, the mechanisms described so far are not quite sufficient to ensure that each state machine executes the same commands in the same order. For example, a follower might be unavailable while the leader commits several log entries, then it could be elected as leader and overwrite these entries with new ones. This section completes the Raft algorithm by adding a restriction on which servers may be elected leader.

#### Election Restriction

Unlike VR, transmitting the necessary entries to new leader, Raft's log entries only flow in one direction: from leaders to followers, and leaders never overwrite existing entries in their logs.

Raft uses voting process to prevent a candidate from winning an election unless it contains all committed entries. The *RequestVote* implements this restriction: the RPC includes information about the candidate's log, and the voter denies its vote if its own log is more up-to-date than that of the candidate.

Raft determines which of two logs is more up-to-date by comparing the index and term of the last entries in the logs. If the logs have last entries with different terms, then the log with the later term is more up-to-date. If the logs end with the same term, then whichever log is longer is more up-to-date.

#### Committing entries from previous terms

**Raft never commits log entries from previous terms by counting replicas.** Only log entries from the leader's current term are committed by counting replicas; once an entry from the current term has been committed in this way, then all prior entries are committed indirectly because of the Log Matching Property.

For the reason why leader can only commit entry in its own term, Figure 4 shows an example:

(for simplicity, entry is indicated as $E_{<index,\ term>}$)

In **(a)**, S1 is elected as leader and append $E_{2,\ 2}$, and if only S2 replicated $E_{2,\ 2}$.

Then go to **(b)**, S1 crashes, S5 can be elected as leader with vote from S3, S4, S5,  then append $E_{2,\ 3}$.

When in **(c)**, S5 crashes with no success replication, S1 restarts and is elected as leader with vote from S1-S4, then S1 will continue to replicated $E_{2,\ 2}$. At this time, $E_{2,\ 2}$ is replicated on a majority of the servers. However, if $E_{2,\ 2}$ is committed here and a election is triggered, S5 have the chance to win the election since it has an entry with larger term.

Then it will turn to **(d)**, where S5 overwrite the "committed" entry $E_{2,\ 2}$. Thus, a leader should not commit the entry that is not appended in the current term even if it is replicated on a majority of the servers.

Only comes to **(e)**, when S1 append $E_{3,\ 4}$ in its current term and commit it, $E_{2,\ 2}$ can be considered as committed.

![Figure 4](/images/raft-commit.png "Figure 4")

#### Safety argument

Given the complete Raft algorithm, this section provides some formal proof of safety.

##### Proof of Leader Completeness Property

**Leader Completeness Property** states that if a log entry is committed in a given term, then that entry will be present in the logs of the leaders for all higher terms.

Let's assume that the Leader Completeness Property does not hold, then prove a contradiction.

Suppose the leader for term $T$ ($leader_T$) commits a log entry from its term, but that log entry is not stored by the leader of some future term. Consider the smallest term $U$ > $T$ whose leader ($leader_U$) does not store the entry.

1. The committed entry must have been absent from $leader_U$’s log at its election (leaders never delete or overwrite entries).
2. $leader_T$ replicated the entry on a majority, and $leader_U$ received votes from a majority. Thus, at least one server (“the voter”) both accepted the entry from $leader_T$ and voted for $leader_U$.
3. The voter must have accepted the committed entry from $leader_T$ before voting for $leader_U$, since if voter votes first, its *currentTerm* will be larger than $leader_T$ and will reject its request.
4. The voter granted its vote to $leader_U$, so $leader_U$’s log must have been as up-to-date as the voter’s. This only comes in two way:
5. First, if the voter and $leader_U$ share the same last log term, then $leader_U$’s log must have been at least as long as the voter’s, so its log should contained every entry in the voter’s log. Comes to contradiction.
6. Otherwise, $leader_U$’s last log term $L$ must be larger than the voter’s (at least $T$), let's say $T<L<U$. However, the earlier leader in term $L$ that created $leader_U$’s last log entry must have contained the committed entry in its log, since we assume $U$ is the smallest term whose leader does not store the entry. Another contradiction.

##### Proof of State Machine Safety Property

**State Machine Safety Property** states that if a server has applied a log entry at a given index to its state machine, no other server will ever apply a different log entry for the same index. 

1. At the time a server applies a log entry to its state machine, its log must be identical to the leader’s log up through that entry and the entry must be committed. 
2. Now consider in some term that a server applies a given log index.
3. The Log Completeness Property guarantees that the leaders for all higher terms will store that same log entry, so servers that apply the index in later terms will apply the same value.

### Follower and candidate crashes

Above only focus on leader failures. Follower and candidate crashes are much simpler to handle. If a follower or candidate crashes, then future *RequestVote* and *AppendEntries* RPCs sent to it will fail. Raft handles these failures by retrying indefinitely. If a server crashes after completing an RPC but before responding, then it will receive the same RPC again after it restarts. Raft RPCs are idempotent, so this causes no harm. For example, if a follower receives an *AppendEntries* request that includes log entries already present in its log, it ignores those entries in the new request.

### Timing and Availability

To ensure availability, Raft will be able to elect and maintain a steady leader as long as the system satisfies the following timing requirement: 

$broadcastTime ≪ electionTimeout ≪ MTBF$

where *MTBF* is the average time between failures for a single server.

### Cluster Membership Changes

TODO

### Log Compaction

Although servers normally take snapshots independently, the leader must occasionally send snapshots to followers that lag behind. This happens when the leader has already discarded the next log entry that it needs to send to a follower.

### Client Interaction

TODO

## References

<a id="1">[1]</a> Ongaro, D., & Ousterhout, J. (2014). In search of an understandable consensus algorithm. In *2014 USENIX annual technical conference (USENIX ATC 14)* (pp. 305-319).

{{< admonition tip >}}
如果对本文有问题或发现错误，欢迎在评论区参与互动或发送邮件联系我！
{{< /admonition >}}
