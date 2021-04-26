---
title: LiveKit Intro
sidebar_label: Home
slug: /
---

LiveKit is an open source project that lets you create scalable, distributed WebRTC rooms within your apps. It provides a scalable WebRTC media server, its own rich signaling protocol, and client SDKs for all major platforms.

## Features

- Horizontally scalable WebRTC-SFU, scales by adding nodes
- High level [client SDKs](references/client-sdks.md) for JS, iOS, Android
- Advanced moderation capability via [server APIs](references/server-apis.md)
- Broad networking compatibility, including WebRTC over TCP
- Easy to deploy, with a single binary and only requires three ports. Pre-made Helm charts for Kubernetes

## Why LiveKit?

We built LiveKit out of frustration with the barrier of entry with building real time audio/video applications. While building [Watercooler](https://watercooler.fm), we realized that hosted solutions are too expensive, and existing OSS media servers were difficult to work with, while missing features that we needed.

LiveKit is designed for those that want to build real-time audio/video capability, and are looking for a "deploy-it-yourself" solution. Compared to hosted solutions like Agora or Twilio Video, LiveKit gives you total control, and lets you keeps costs under control.

## Architecture

LiveKit is built with [Pion](https://github.com/pion/webrtc), an excellent Go-based WebRTC implementation.

![LiveKit Architecture](/img/architecture.png)
