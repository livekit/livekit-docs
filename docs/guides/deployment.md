---
title: Deploying LiveKit
---

## Kubernetes

## Increasing UDP Receive Buffer

By default, Linux places restrictive limits on the amount of UDP data the kernel buffers before dropping it. The default limits do not work well with WebRTC, where majority of the data is through UDP.

You can check the current limits with the following:

```shell
$ sysctl net.core.rmem_max
net.core.rmem_max = 425984
```

We suggest setting this value to at least 5M, or 5000000 bytes. To increase the receive buffer, you can change it by updating `/etc/sysctl.conf` (takes effect on next reboot)

```title="/etc/sysctl.conf"
net.core.rmem_max=5000000
```

You could also update the values immediately, run the following as root:

```shell
$ sudo sysctl -w net.core.rmem_max=5000000
net.core.rmem_max = 5000000
```

This setting is applied automatically if you are using our Kubernetes helm chart.
