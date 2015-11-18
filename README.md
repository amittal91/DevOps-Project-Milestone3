## DevOps Milestone 3 - Deployment

### Introduction

For this milestone, we have created droplets on Digital Ocean that would act as different servers.
* Droplet 1: Production Server
* Droplet 2: Canary Server
* Droplet 3: Proxy Server
* Droplet 4: Global Redis Server

We have re-used the code of HW1 for spinning up digital ocean droplets using 'needle' api and creating the inventory file entry that is read by ansible playbook.

We have used ansible as the Configuration Management Tool and Jenkins as the Build Server. We have created a sample node js app with Jasmine Testing and PMD Analysis.

### Tasks

#### Automatic configuration of production environment
* The code related to spinning up a droplet acting as the Production Server, creating inventory entry, production server configuration yml read by ansible playbook can be found in the ['Prod'](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/Prod) directory
* A file namely 'digitalocean_config.json' would have key-value pairs for token, ssh_key and keypath to the private key
* The file ['prod_configuration.yml'](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/Prod/prod_configuration.yml) contains all the pre-requisites like nodejs, npm, forever, python, etc which would be installed as a part of configuration management on the Prod Server
* Our script namely ['setup_prod.sh'](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/setup_prod.sh) would be executed for this task. This would create a Prod server and through ansible playbook command configure all dependencies/pre-requisites on the remote server

#### Triggered, remote deployment
#### Feature Flags
#### Metrics and alerts
#### Canary releasing

### Screencast

[Milestone 3 - Demo](https://youtu.be/2mQynj8z-Ew)
