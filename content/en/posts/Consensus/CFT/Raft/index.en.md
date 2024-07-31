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

Raft applied specific techniques to improve understandability, including **decomposition** (Raft separates leader election, log replication, and safety) and **state space reduction** (Raft reduces the degree of nondeterminism and the ways servers can be inconsistent with each other). Raft is similar in many ways to existing consensus algorithms (Oki and Liskov’s Viewstamped Replication [29, 22]), but it has several novel features:

* **Strong Leader**: Log entries only flow from the leader to other servers
* **Leader election**: Raft uses randomized timers to elect leaders.
* **Membership changes**: Cluster can continue operating normally during configuration changes.



## The Raft Consensus Algorithm

### basics

role: leader, follower, candidate

only one leader, others are follower

follower is passive, only respond, don't request

leader handle client request, follower redirect client request to leader

candidate is used to elect a leader

raft divide time into terms, numbered with consecutive integer

each term begin with election

a term can end with no leader

each server has a current term, exchange this when communicate

if stale term found, request will be rejected, leader or candidate will turn to follower

raft communicate with remote procedure calls (RPC)



### Leader election

use heartbeat mechanism to trigger leader election

Leaders send periodic heartbeats (AppendEntries RPCs that carry no log entries)

If a follower receives no communication over a period of time called the election timeout, then it assumes there is no viable leader and begins an election to choose a new leader.

follower will turn to candidate, vote for itself and send request vote to other server

each server vote at most one candidate in a given term, on a first-come-first-served basis

A candidate wins an election if it receives votes from a majority of the servers in the full cluster for the same term.

A candidate continues in this state until one of three things happens: 

* it wins the election
* another server establishes itself as leader
* a period of time goes by with no winner

#### candidate wins

receive majority vote from same term, turn to leader, send heartbeat to servers

#### other server wins

receive heartbeat with term not smaller than its own, turn to follower, otherwise reject

#### no one wins

start a new election by incrementing its term and initiating another round of RequestVote RPCs. 

However, without extra measures split votes could repeat indefinitely.

uses randomized election timeouts to ensure that split votes are rare

To prevent split votes in the first place, election timeouts are chosen randomly



### Log replication

client send request with command

leader append it to log, send request to other server

if entry safely replicated, apply to state machine and return to client

if follower not response, retries indefinitely even has return to client

The leader keeps track of the highest index it knows to be committed, and it includes that index in future AppendEntries RPCs (including heartbeats) so that the other servers eventually find out.

Once a follower learns that a log entry is committed, it applies the entry to its local state machine (in log order).

* If two entries in different logs have the same index and term, then they store the same command. 
* If two entries in different logs have the same index and term, then the logs are identical in all preceding entries.

When sending an AppendEntries RPC, the leader includes the index and term of the entry in its log that immediately precedes the new entries.

If the follower does not find an entry in its log with the same index and term, then it refuses the new entries. 

The consistency check acts as an induction step: the initial empty state of the logs satisfies the Log Matching Property, and the consistency check preserves the Log Matching Property whenever logs are extended. As a result, whenever AppendEntries returns successfully, the leader knows that the follower’s log is identical to its own log up through the new entries.



To bring a follower’s log into consistency with its own, the leader must find the latest log entry where the two logs agree, delete any entries in the follower’s log after that point, and send the follower all of the leader’s entries after that point.



When a leader first comes to power, it initializes all nextIndex values to the index just after the last one in its log (11 in Figure 7). If a follower’s log is inconsistent with the leader’s, the AppendEntries consistency check will fail in the next AppendEntries RPC. After a rejection, the leader decrements nextIndex and retries the AppendEntries RPC.



### Safety

#### Election restriction

This means that log entries only flow in one direction, from leaders to followers, and leaders never overwrite existing entries in their logs.

If the candidate’s log is at least as up-to-date as any other log in that majority (where “up-to-date” is defined precisely below), then it will hold all the committed entries. The RequestVote RPC implements this restriction: the RPC includes information about the candidate’s log, and the voter denies its vote if its own log is more up-to-date than that of the candidate.

Raft determines which of two logs is more up-to-date by comparing the index and term of the last entries in the logs. If the logs have last entries with different terms, then the log with the later term is more up-to-date. If the logs end with the same term, then whichever log is longer is more up-to-date.

#### Committing entries from previous terms

Raft never commits log entries from previous terms by counting replicas. Only log entries from the leader’s current term are committed by counting replicas; once an entry from the current term has been committed in this way, then all prior entries are committed indirectly because of the Log Matching Property

#### Safety argument

some proof

### Follower and candidate crashes

### Timing and availibility

### Cluster Membership Changes

### Log Compaction

Although servers normally take snapshots independently, the leader must occasionally send snapshots to followers that lag behind. This happens when the leader has already discarded the next log entry that it needs to send to a follower.



## References

<a id="1">[1]</a> Ongaro, D., & Ousterhout, J. (2014). In search of an understandable consensus algorithm. In *2014 USENIX annual technical conference (USENIX ATC 14)* (pp. 305-319).
