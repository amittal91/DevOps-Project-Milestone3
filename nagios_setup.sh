sudo apt-get -y update
sudo apt-get -y install build-essential libgd2-xpm-dev apache2-utils unzip
sudo useradd -m nagios
sudo passwd nagios
You have to enter password twice
sudo groupadd nagcmd
sudo usermod -a -G nagcmd nagios
sudo usermod -a -G nagcmd www-data
wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.1.1.tar.gz
wget http://nagios-plugins.org/download/nagios-plugins-2.0.3.tar.gz
tar xzf nagios-4.1.1.tar.gz



PYhton 

install smtp
install python-dev
Install pip