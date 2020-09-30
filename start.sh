#! /bin/bash
cd /home/pi/Battlebots
git pull
export NODE_OPTIONS=--max-old-space-size=900
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4443
sudo iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport 443 -j REDIRECT --to-ports 4443
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8888
sudo iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport 80 -j REDIRECT --to-ports 8888
cd infra && make prepare &&  make run:battlebots
