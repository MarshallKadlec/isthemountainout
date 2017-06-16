#!/bin/bash
/usr/mtn/ngrok/ngrok start -config /usr/mtn/ngrok/ngrok.yml mtn &
cd /usr/mtn/app
node app