#!/bin/bash
zip Proxy.zip package.json proxyServer.js
pwd
echo "-------------------------------------------------------------------------"
echo "Installing dependencies..."
npm install
echo "Successfully installed the required dependencies."
echo "-------------------------------------------------------------------------"
node digitalocean.js
echo "-------------------------------------------------------------------------"
echo "Waiting for the digital ocean droplet to get properly initialized....."
sleep 120
echo "-------------------------------------------------------------------------"
echo "Running the ansible playbook now."
pwd
ansible-playbook -i inventory --sudo proxy_configuration.yml
echo "Playbook executed successfully."
echo "-------------------------------------------------------------------------"