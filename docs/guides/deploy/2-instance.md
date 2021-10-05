---
title: Simple Cloud Instance
---

# LiveKit Server Deployment

This document covers setting up LiveKit server instance. Prerequesits are:
  - A valid self-generated LiveKit API key, following the instructions in the [Getting Started](/guides/getting-started#generate-api-key-and-secret) guide.
  - A valid SSL certificate and private key, which can be purchased anywhere that sells SSL certificates such as [Namecheap](https://www.namecheap.com/security/ssl-certificates/).
  - Ability to add a DNS record pointing to your new LiveKit server.

## Deployment
You have the choice of deploying LiveKit using [Cloud Init](#cloud-init) or with a [Custom Built Cloud Image](#custom-built-cloud-image). All custom configuration can go into the Cloud Init config, or you can SSH into your LiveKit server instance after it has been created in order to set configuration files. The LiveKit `config.yaml` file is located at `/opt/livekit-server/config.yaml`.

If you prefer to deploy LiveKit on Kubernetes, see the [Kubernetes guide](/guides/deploy/kubernetes) instead.

### Cloud Init
You can deploy a LiveKit server using a vanilla Linux image and Cloud Init configuration file.

#### AWS EC2

LiveKit Server can be deployed with either Amazon Linux 2 or Ubuntu. Use the `cloud-init.<platform>.yaml` file corresponding to your desired platform:
  - For Amazon Linux 2, use [cloud-init.amzn2.yaml](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/cloud-init.amzn2.yaml)
  - For Ubuntu, use [cloud-init.ubuntu.yaml](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/cloud-init.ubuntu.yaml)

Steps: 
  1. Download one of the above `cloud-init.<platform>.yaml` files. Edit it to include your LiveKit Server configuration, SSL certificate, and SSL private key.
  2. Open the [AWS Console](https://console.aws.amazon.com/ec2) and navigate to EC2.
  3. Launch an instance.
  4. Choose the latest "Amazon Linux 2" AMI.
  5. In the "Step 3: Configure Instance Details" screen, copy and paste text from your modified `cloud-init.yaml` file from step 1 into the "User data" field, under the "Advanced Details" section.
  6. Launch your instance as usual.


### Custom Built Cloud Image
You can build your own custom cloud image, and bake in any configuration you like.

#### AWS EC2

##### Amazon Linux 2
  1. [Install Packer](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli)
  2. (Optional) Edit [livekit-server/deploy/config.pkr.hcl](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/config.pkr.hcl)
  3. Build your AMI:
```
cd livekit-server/deploy
packer build .
```
  4. Edit [cloud-init.lk-image.yaml](https://raw.githubusercontent.com/livekit/livekit-server/master/deploy/cloud-init.lk-image.yaml) with your LiveKit Server configuration.
  5. Open the [AWS Console](https://console.aws.amazon.com/ec2) and navigate to EC2.
  6. Launch an instance.
  7. Choose custom built AMI.
  8. In the "Step 3: Configure Instance Details" screen, copy and paste text from your modified `cloud-init.yaml` file from step 1 into the "User data" field, under the "Advanced Details" section.
  9. Launch your instance as usual.

## Firewall
After you have [deployed](#deployment) LiveKit using one of the methods above, make sure your AWS Security Group is configured to allow the following ports to your LiveKit Instance:
  - TCP 22   - SSH
  - TPC 443  - SSL terminated WebSocket
  - TCP 7880 - Plaintext WebSocket
  - TCP 7881 - RTC TCP
  - UDP 7882 - RTC UDP