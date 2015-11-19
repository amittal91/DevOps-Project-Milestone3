## DevOps Milestone 3 - Deployment

### Introduction

For this milestone, we have created droplets on Digital Ocean that would act as different servers.
* Droplet 1: Production Server
* Droplet 2: Canary Server
* Droplet 3: Proxy Server
* Droplet 4: Global Redis Server

We have re-used the code of HW1 for spinning up digital ocean droplets using 'needle' api and creating the inventory file entry that is read by ansible playbook.

We have used Ansible as the Configuration Management Tool and Jenkins as the Build Server. We have created a sample node js app and added Jasmine Tests and PMD Analysis to it.

### Tasks

#### Automatic configuration of production environment
* The code related to spinning up a droplet acting as the Production Server, creating inventory entry, production server configuration yml read by ansible playbook can be found in the [Prod](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/Prod) directory
* A file namely 'digitalocean_config.json' would have key-value pairs for token, ssh_key and keypath to the private key
* The file [prod_configuration.yml](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/Prod/prod_configuration.yml) contains all the pre-requisites like nodejs, npm, forever, python, etc which would be installed as a part of configuration management on the Prod Server
* Our script namely [setup_prod.sh](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/setup_prod.sh) would be executed for this task. This would create a Prod server and through ansible playbook command configure all dependencies/pre-requisites on the remote server

#### Triggered, remote deployment
* We have used Jenkins as the Build Server and configured a job to track the local git repository for our node js application. Jenkins configuration files are present [here](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/Jenkins)
* We have written a [post-commit hook](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/Hooks/post-commit) to trigger the build in Jenkins. This hook tracks the status of the build. If the build fails due to either test failure or PMD analysis failure, the repo will get reset to the previous stable commit
* We have used Jasmine testing for node js app and specified the same in [package.json](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/App/package.json). The tests are written in [spec](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/App/spec) directory
* We have used PMD to do analysis of node js files and the command `$WORKSPACE/pmd-bin-5.4.0/bin/run.sh pmd -d $WORKSPACE/App/app.js -R rulesets/ecmascript/braces.xml -f xml -language javascript &gt; pmd.xml` has been configured in the Jenkins job. The zip for pmd is located [here](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/pmd-bin-5.4.0)
* When the build is successful, the user can push the changes to the remote repository
* We have written a [pre-push hook](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/Hooks/pre-push) that would deploy the changes to remote git repository and to the production server via ansible. The file namely [prod_deploy.yml](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/prod_deploy.yml) will be used by ansible to push the changes and start the server on the remote prod server

#### Feature Flags
* We have used a Global Redis Store to maintain the value of feature flag setting. We used another Digital Ocean droplet as the Redis Server by installing Redis as follows `apt-get install redis-server`. Further modified the file `/etc/redis/redis.conf` and updated the value `bind 127.0.0.1` to `bind 0.0.0.0` to set up remote access to redis server on port 6379
* We have created another [node js app](https://github.com/amittal91/DevOps-Project-Milestone3/tree/master/FeatureFlag) running at `http://localhost:3001` would toggle the value of feature flag. This flag value will be accessed in Production Server by our [app](https://github.com/amittal91/DevOps-Project-Milestone3/blob/master/App/app.js) to provide access to the functionality of `set/get tokens`
* By default, the feature flag would be set to true, thus giving access to set/get functionality on prod server
* Every request sent to `http://localhost:3001/feature` would toggle the flag value, thereby enabling or disabling the feature in production

#### Metrics and alerts
* The folder named [Monitor](https://github.com/amittal91/DevOps-Project-Milestone3/tree/canary/Monitor) contains the scripts that deal with metrics monitoring
* We are monitoring two metrics - `CPU Utilization and Memory Utilization` using python scripts named [cpuMonitor.py](https://github.com/amittal91/DevOps-Project-Milestone3/blob/canary/Monitor/cpuMonitor.py) and [memoryMonitor.py](https://github.com/amittal91/DevOps-Project-Milestone3/blob/canary/Monitor/memoryMonitor.py) and psutils library
* We have set 60% and 30% as threshold values for cpu and mem utilization respectively as found [here](https://github.com/amittal91/DevOps-Project-Milestone3/blob/canary/Monitor/monitor.sh)
* We have configured smtp server by following the steps mentioned [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-postfix-as-a-send-only-smtp-server-on-ubuntu-14-04) for the ability to send email notifications when the metrics exceed threshold values

#### Canary releasing
* We have created another Digital Ocean droplet that would be used as a Canary Server. We have created another branch named 'canary' for canary release. The process for spinning up a droplet, automatic configuration management and triggered remote deployments for this server are identical to the actual Production Server as mentioned in first two steps. The branch contents can be viewed [here](https://github.com/amittal91/DevOps-Project-Milestone3/tree/canary)
* Canary Release - We have made a slight change in the message displayed on the homepage of the [app](https://github.com/amittal91/DevOps-Project-Milestone3/blob/canary/App/app.js) and displayed the process of canary release to this server from canary branch
* We created an http proxy server on another Droplet that would handle routing to Production and Canary Servers in the ratio of 3:1 i.e. 75% requests routed to Production server and 25% requests routed to Canary Server. 
* Further, we have used the same global redis store to store the value of whether an alert has been raised or not on the canary server. When the monitoring script is invoked, it checks if values are above threshold. If yes, the value is stored in redis through [redis client](https://github.com/amittal91/DevOps-Project-Milestone3/blob/canary/redisAlert.js). This value is used by the proxy server to determine if alert is yes or no. If alert is yes, then traffic will be routed to Production server instead of Canary, thus sending all requests to only Production
* The code that deals with distributing traffic and stops routing traffic to canary when alert is reached can be found in [proxyServer.js](https://github.com/amittal91/DevOps-Project-Milestone3/blob/canary/ProxyServer/proxyServer.js) file

### Screencast

[Milestone 3 - Demo](https://youtu.be/2mQynj8z-Ew)
