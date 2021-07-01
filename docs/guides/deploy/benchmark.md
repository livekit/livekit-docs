---
title: Benchmarking
---

## Measuring performance

LiveKit can scale to many simulteneous rooms via scaling horizontally, but each room must fit within a single node. For this reason, benchmarks below will be focused on stressing the number of concurrent users in a room.

With WebRTC SFUs, the main proxy for how much work the server is doing is total fowarded bitrate.

```
Total forwarded bitrate = per track bitrate * tracks published * number of subscribers
```

For example, for a room with 6 publishers, each publishing one video stream at 600kbps, and 100 subscribers, total forwarded bitrate would be ~360Mbps.

We have a couple of different tools to help you understand the limits of your deployment.

### CLI load tester

`livekit-load-tester` comes as part of [livekit-cli](https://github.com/livekit/livekit-cli) repo. It uses our Go SDK to act as either a publisher or a subscriber in a room.

For publishing, it sends packets simulating a particular bitrate. This makes it a good approximation for audio streams, but less so for video. With real video tracks, the publisher responds to downstream feedback such as PLI packets and would then produce I frames.

When it's used as a subscriber, it will compute packet loss and produce NACKs, but does not produce PLI.

### Headless chrome

A closer approximation to real world traffic, especially for video, would be to run headless Chrome instances to join the room. We've created a [Chrometester](https://github.com/livekit/chrometester) for this purpose. This docker image will start Chromemium in headless mode, and use our react example app to join a test room.

Chrometester can join only as a subscriber, since it doesn't have a camera or microphone to produce real data as a publisher.

## Benchmarks

We've ran benchmarks for a few different scenarios to give a general understanding of performance. All benchmarks are ran with the server running on an `c2-standard-8` instance on Google Cloud.

### Audio only

This simulates an audio only experience with various number of speakers and listeners. It's performed using CLI load tester using a bitrate of 20kbps.

| Publishers | Subscribers | Tracks | Latency | Packet loss |
| ---------- | ----------- | ------ | ------- | ----------- |
| 9          | 0           | 72     | 46.6ms  | 0.0000%     |
| 9          | 100         | 972    | 47.6ms  | 0.0002%     |
| 50         | 0           | 2450   | 47.7ms  | 0.0005%     |
| 9          | 500         | 4572   | 186.9ms | 0.0010%     |
| 100        | 0           | 9900   | 368.9ms | 0.0002%     |
| 10         | 1000        | 10090  | 384.0ms | 0.0001%     |

### Video room

This simulates a large room with a limited number of publishers and many viewers. We started 6 publishers (using example.livekit.io) each publishing audio and video (960x540) with simulcast enabled. We then spun up instances of Chrometester on Kubernetes, joining the same room as subscribers. At around 320 subscribers, we started experiencing video artifacts caused by high packet loss.

There is still opportunity to optimize this use case. When the limits were reached, we noticed only some of the cores on the machine were fully utilized, while others still had capacity for more. This is on our roadmap for improving in the near future, and we welcome contributions!
