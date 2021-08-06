---
title: Recording Service
---

The recording service only requires access to the same redis cluster as your LiveKit server.

## Config

The only required field is your redis address.
Additionally, if you'll be starting template recordings by room name (instead of token), you'll need to supply your server api key and token.

```yaml
redis:
    address: redis address, including port (required)
    username: redis username (optional)
    password: redis password (optional)
    db: redis db (optional)
api_key: livekit server api key (required if using templates without supplying tokens)
api_secret: livekit server api secret (required if using templates without supplying tokens)
# default recording options (optional)
options:
    input_width: defaults to 1920
    input_height: defaults to 1080
    output_width: defaults to 0 (no scaling)
    output_height: defaults to 0 (no scaling)
    depth: defaults to 24
    framerate: defaults to 30
    audio_bitrate: defaults to "128k"
    audio_frequency: defaults to "44100"
    video_bitrate: defaults to "2976k"
log_level: valid levels are debug, info, warn, error, fatal, or panic (optional)
```

## Ensuring availability

Each instance of the recorder service can record one job at a time. Since memory utilization is more stable than CPU 
utilization, we recommend autoscaling based on memory. Recording at 1080p/30fps/4500kbps (the defaults), the recorder 
service uses about 400 MB and 2.5 CPU on average, so we use the following resource request and autoscaling:

```yaml
autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 10
  targetMemoryUtilizationPercentage: 50
  
resources:
   requests:
     cpu: 3000m
     memory: 500Mi
   limits:
     cpu: 5000m
     memory: 1500Mi
```

## Helm

If you already deployed the server using our Helm chart, jump to `helm install` below.

Ensure [Helm](https://helm.sh/docs/intro/install/) is installed on your machine.

Add the LiveKit repo

```shell
$ helm repo add livekit https://helm.livekit.io
```

Create a values.yaml for your deployment, using [recorder-sample.yaml](https://github.com/livekit/livekit-helm/blob/master/recorder-sample.yaml) as a template.
Each instance can record one room at a time, so be sure to either enable autoscaling, or set replicaCount >= the number of rooms you'll need to simultaneously record.

Then install the chart

```shell
$ helm install <instance_name> livekit/livekit-recorder --namespace <namespace> --values values.yaml
```

We'll publish new version of the chart with new recorder releases. To fetch these updates and upgrade your installation, perform

```shell
$ helm repo update
$ helm upgrade <instance_name> livekit/livekit-recorder --namespace <namespace> --values values.yaml
```
