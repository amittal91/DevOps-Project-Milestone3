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
* The code related to spinning up a droplet acting as the Production Server, creating inventory entry, production server configuration yml read by ansible playbook can be found in the [Prod](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/Prod) directory
* A file namely 'digitalocean_config.json' would have key-value pairs for token, ssh_key and keypath to the private key
* The file [prod_configuration.yml](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/Prod/prod_configuration.yml) contains all the pre-requisites like nodejs, npm, forever, python, etc which would be installed as a part of configuration management on the Prod Server
* Our script namely [setup_prod.sh](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/setup_prod.sh) would be executed for this task. This would create a Prod server and through ansible playbook command configure all dependencies/pre-requisites on the remote server

#### Triggered, remote deployment
* We have used Jenkins as the Build Server and configured a job to track the local git repository for our node js application
* We have written a [post-commit hook](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/Hooks/post-commit) to trigger the build in Jenkins. This hook track the status of the build. If the build fails due to either test failure or PMD analysis failure, the repo will get reset to the previous stable commit
* We have used Jasmine testing for node js app and specified the same in [package.json](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/App/package.json). The tests are written in [spec](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/App/spec) directory
* We have used PMD to do analysis of node js files and the command `Add Command` has been configured in the Jenkins job. The zip for pmd is located [here](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/pmd-bin-5.4.0)
* When the build is successful, the user can push the changes to the remote repository
* We have written a [pre-push hook](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/Hooks/pre-push) that would deploy the changes to remote git repository and to the production server via ansible. The file namely [prod_deploy.yml](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/prod_deploy.yml) will be used by ansible to push the changes and start the server on the remote prod server

#### Feature Flags
* We have used a Global Redis Store to maintain the value of feature flag setting. We used another Digital Ocean droplet as the Redis Server by installing Redis as follows `apt-get install redis-server`. Further modified the file `/etc/redis/redis.conf` and updated the value `bind 127.0.0.1` to `bind 0.0.0.0` to set up remote access to redis server
* We have created another [node js app](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/FeatureFlag) running at `http://localhost:3001` would toggle the value of feature flag. This flag value will be accessed in Production Server by our [app](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/App/app.js) to provide access to the functionality of `set/get tokens`
* By default, the feature flag would be set to true, thus giving access to set/get functionality on prod server
* Every request sent to `http://localhost:3001/feature` would toggle the flag value, thereby enabling or disabling the feature in production

#### Metrics and alerts
#### Canary releasing

### Screencast

[Milestone 3 - Demo](https://youtu.be/2mQynj8z-Ew)
