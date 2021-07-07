---
title: Benchmarking
---

## Measuring performance

LiveKit can scale to many simulteneous rooms by running a distributed setup across multiple nodes. However, each room must fit within a single node. For this reason, benchmarks below will be focused on stressing the number of concurrent users in a room.

With WebRTC SFUs, the main proxy for how much work the server is doing is total fowarded bitrate.

```
Total forwarded bitrate = per track bitrate * tracks published * number of subscribers
```

For example, for a room with 6 publishers, each publishing one video stream at 600kbps, and 100 subscribers, total forwarded bitrate would be ~360Mbps.

We have a couple of different tools to help you understand the limits of your deployment.

### CLI load tester

`livekit-load-tester` comes as part of [livekit-cli](https://github.com/livekit/livekit-cli) repo. It uses our Go SDK to act as either a publisher or a subscriber in a room.

For publishing, it sends packets simulating a particular bitrate. This makes it a good approximation for audio streams, but less so for video. With real video tracks, the publisher responds to downstream feedback such as PLI packets and would then produce I frames.

As a subscriber, it will compute packet loss and produce NACKs, but does not produce PLI.

When benchmarking with the load tester, be sure to run it on a machine with plenty of resources, and that the [sysctl parameters](tuning) have been tuned.

### Headless chrome

A closer approximation to real world traffic, especially for video, would be to run headless Chrome instances to join the room. We've created a [Chrometester](https://github.com/livekit/chrometester) for this purpose. This docker image will start Chromemium in headless mode, and use our react example app to join a test room.

Chrometester can join only as a subscriber, since it doesn't have a camera or microphone to produce real data as a publisher.

## Benchmarks

We've ran benchmarks for a few different scenarios to give a general understanding of performance. All benchmarks are ran with the server running on a 16-core, compute optimized instance on Google Cloud. ( `c2-standard-16`)

### Audio only

This simulates an audio only experience with various number of speakers and listeners. It's performed using CLI load tester using a bitrate of 20kbps.

| Pubs | Subs | Tracks | Audio | Latency | Packet loss |
| :--- | :--- | :----- | :---- | :------ | :---------- |
| 9    | 0    | 71     | Yes   | 46.7ms  | 0.000%      |
| 9    | 100  | 971    | Yes   | 46.3ms  | 0.000%      |
| 50   | 0    | 2450   | Yes   | 46.5ms  | 0.000%      |
| 9    | 500  | 4572   | Yes   | 47.9ms  | 0.000%      |
| 100  | 0    | 9899   | Yes   | 48.9ms  | 0.000%      |
| 10   | 1000 | 10090  | Yes   | 53.6ms  | 0.014%      |
| 10   | 2500 | 25090  | Yes   | 93.1ms  | 0.145%      |

### Video room

This simulates a large room with a limited number of publishers and many viewers. We started **4 publishers** (using example.livekit.io) each publishing audio and video (960x540) with simulcast enabled. We then spun up instances of Chrometester on Kubernetes, joining the same room as subscribers. At around **440** subscribers, we started experiencing video artifacts caused by high packet loss. When that happened, we observed the server instance had maxed out on CPU usage.
