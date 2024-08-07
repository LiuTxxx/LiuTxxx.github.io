---
title: Raft Detailed Explanation
date: 2024-07-30T15:46:24+0800
type: posts
description: Detailed explanation on raft algorithm's paper
resources:
  - name: featured-image
    src: 911.jpg
tags: 
  - Raft
  - CFT
  - Consensus
  - SMR
categories:
  - Paper Notes
collections:
  - CFT Consensus
---
{{< admonition abstract >}}
This post is written mainly based on the work of Ongaro et al. [[1]](#1)
{{< /admonition >}}

## Introduction

Consensus algorithms can enforce a collection of machines to maintain same total order of messages or inputs to ensure their state consistency. Paxos [[2]](#2) [[3]](#3) once dominated the discussion of consensus algorithm, lots of the consensus implementations are based on Paxos or influenced by it.

However, Paxos is quite difficult to understand, thus, Ongaro et al posted a brand new consensus algorithm that has better understandability and more practical application scenarios: Raft.

Raft applied specific techniques to improve understandability, including **decomposition** (Raft separates leader election, log replication, and safety) and **state space reduction** (Raft reduces the degree of nondeterminism and the ways servers can be inconsistent with each other). Raft is similar in many ways to existing consensus algorithms (e.g. Viewstamped Replication [29, 22]), but it has several novel features:

* **Strong Leader**: Log entries only flow from the leader to other servers
* **Leader election**: Raft uses randomized timers to elect leaders.
* **Membership changes**: Cluster can continue operating normally during configuration changes.

## The Raft Consensus Algorithm

### Overview

Raft decomposes the consensus problem into three relatively independent subproblems, which are discussed in the subsections that follow:

* **Leader election**: elect new leader when an existing leader fails
* **Log replication**: the leader accept log entries from clients and replicate them across the cluster
* **Safety**: the key safety properties for Raft are listed below:
  * **Election Safety**: at most one leader can be elected in a given term.
  * **Leader Append-Only**: a leader never overwrites or deletes entries in its own log, it only appends new entries.
  * **Log Matching**: if two logs contain an entry with the same index and term, then the logs are identical in all entries up through the given index.
  * **Leader Completeness**: if a log entry is committed in a given term, then that entry will be present in the logs of the leaders for all higher-numbered terms, which means that a committed entry should never be overwritten.
  * **State Machine Safety**: if a server has applied a log entry at a given index to its state machine, no other server will ever apply a different log entry for the same index.

#### Replicated State Machines

![Figure 1](/images/raft-smr.png "Figure 1")

Replicated state machines are typically implemented using a replicated log, as shown in Figure 1. Each server stores a log containing a series of commands, which its state machine executes in order. Each log contains the same commands in the same order, so each state machine processes the same sequence of commands.

Keeping the replicated log consistent is the job of the consensus algorithm. The consensus module on a server receives commands from clients and adds them to its log. It ensure that every log eventually contains the same requests in the same order, even if some servers fail.

#### Variables and Storage

TODO...

### Raft Basics

Raft has three main roles: **leader**, **follower**, **candidate**.

In all the normal case, there will be at most one leader, and others are followers or candidates.

**Leader** is resiponsible to handle clients' requests, and if the request is sent to follower, it will redirect this request to leader. when leader receive request from client, it will send messages to all follower to inform them to append an entry to their logs. **Followers** are passive, they only respond requests, don't send request themselves. **Candidate** is used to elect a leader.

Raft divide time into **terms**, numbered with consecutive integer, each term begin with an election, a term can end with no leader if no candidate gains enough votes.

Raft communicate with remote procedure calls (**RPC**), each server will record a *current term* number, ***currentTerm*** will be attached to every messages for communication. Servers will compare their *currentTerms*, if stale term found, request will be rejected. The server with lower term number will update its *currentTerm* with the larger one, if this server is leader or candidate, it will turn to a follower.

### Leader Election

Raft uses **heartbeat** mechanism to detect the liveness and trigger leader election. Leader will send periodic heartbeats (*AppendEntries* that carry no log entries) to all followers, if a follower receives no heartbeat over a period of time, called the election timeout, or receives a vote request, it assumes there is no viable leader and begins an election.

Once a follower triggers a election, it will turn to candidate, vote for itself and send *RequestVote* to other server, each server can vote at most one candidate in a given term, on a first-come-first-served basis. A candidate wins an election if it receives votes from a majority of the servers in the same term.

A candidate continues in this state until one of three things happens:

* It wins the election
* Another server wins the election
* A period of time goes by with no winner

#### Candidate Wins

The candidate receives majority vote in same term, it turns to leader, send heartbeat to all servers (followers).

#### Another Server Wins

The candidate receives heartbeat with term not smaller than its own, it turns to follower, otherwise reject the request.

#### No Server Wins

In a period of time, no candidate gets majority votes, triggers election timeout, then a new election will be started by incrementing its term and initiating another round of *RequestVote*. However, without extra measures, split votes could repeat indefinitely. Thus Raft uses randomized election timeouts to ensure that split votes are rare. Which means election timeouts are chosen randomly, to avoid candidates send *RequestVote* at the same time.

![Figure 2](/images/raft-server-state.png "Figure 2")

The server state transition diagram are shown in the Figure 2.

### Log Replication

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

Let's assume that the Leader Completeness Property does not hold, then prove a contradiction. 

Suppose the leader for term $T$ ($leader_T$) commits a log entry from its term, but that log entry is not stored by the leader of some future term. Consider the smallest term $U$ > $T$ whose leader ($leader_U$) does not store the entry.

1. The committed entry must have been absent from $leader_U$’s log at its election (leaders never delete or overwrite entries).
2. $leader_T$ replicated the entry on a majority, and $leader_U$ received votes from a majority. Thus, at least one server (“the voter”) both accepted the entry from $leader_T$ and voted for $leader_U$.
3. The voter must have accepted the committed entry from $leader_T$ before voting for $leader_U$, since if voter votes first, its *currentTerm* will be larger than $leader_T$ and will reject its request.
4. The voter granted its vote to $leader_U$, so $leader_U$’s log must have been as up-to-date as the voter’s. This only comes in two way:
5. First, if the voter and $leader_U$ share the same last log term, then $leader_U$’s log must have been at least as long as the voter’s, so its log should contained every entry in the voter’s log. Comes to contradiction.
6. Otherwise, $leader_U$’s last log term $L$ must be larger than the voter’s (at least $T$), let's say $T<L<U$. However, the earlier leader in term $L$ that created $leader_U$’s last log entry must have contained the committed entry in its log, since we assume $U$ is the smallest term whose leader does not store the entry. Another contradiction.

##### Proof of State Machine Safety Property



### Follower and candidate crashes

### Timing and availability

### Cluster Membership Changes

### Log Compaction

Although servers normally take snapshots independently, the leader must occasionally send snapshots to followers that lag behind. This happens when the leader has already discarded the next log entry that it needs to send to a follower.

## References

`<a id="1">`[1]`</a>` Ongaro, D., & Ousterhout, J. (2014). In search of an understandable consensus algorithm. In *2014 USENIX annual technical conference (USENIX ATC 14)* (pp. 305-319).

```markdown
{{< admonition tip >}}
If you have any questions or find any errors, feel free to interact in the comments section!
{{< /admonition >}}
```
