---
title: Kubernetes
---

We've created a helm chart that makes deploying to Kubernetes simple. It will help you set up a distributed deployment of LiveKit, along with a Service and Ingress to correctly route traffic.

Our [Helm chart](https://github.com/livekit/livekit-helm) supports GKE and EKS out of the box, and can serve as a guide on your custom Kubernetes installations.

## Understanding the deployment

LiveKit pods requires direct access to the network with host networking. This means that the rtc.udp/tcp ports that are open on those nodes are directly handled by LiveKit server. With that direct requirement of specific ports, it means we'll be limited to one LiveKit pod per node. It's possible to run other workload on those nodes.

Termination of TLS/SSL is left as a responsibility of the Ingress. Our Helm chart will configure TLS termination for GKE and ALB load balancers. To use ALB on EKS, AWS Load Balancer Controller needs to be [installed separately](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html).

![Kubernetes Deployment](/img/deploy/kubernetes.svg)

## Using the Helm Chart

Ensure [Helm](https://helm.sh/docs/intro/install/) is installed on your machine.

Then add the LiveKit repo

```shell
$ helm repo add livekit https://helm.livekit.io
```

Create a values.yaml for your deployment, using [values-sample.yaml](https://github.com/livekit/livekit-helm/blob/master/values-sample.yaml) as a template.

Then install the chart

```shell
$ helm install <instance_name> livekit/livekit-server --namespace <namespace> --values values.yaml
```

We'll publish new version of the chart with new server releases. To fetch these updates and upgrade your installation, perform

```shell
$ helm repo update
$ helm upgrade <instance_name> livekit/livekit-server --namespace <namespace> --values values.yaml
```
