FROM ubuntu:latest

# Install Node JS
RUN apt-get update && apt-get install -y nodejs \
&& apt-get install -y npm && ln -s /usr/bin/nodejs /usr/bin/node
ADD ./app/package.json /usr/mtn/app/package.json
RUN npm --prefix /usr/mtn/app install
EXPOSE 3000

WORKDIR /usr/mtn
ADD ./app /usr/mtn/app
ADD ./ngrok /usr/mtn/ngrok
ADD ./start.sh /usr/mtn/start.sh

RUN chmod +x /usr/mtn/ngrok/ngrok && chmod +x /usr/mtn/start.sh
CMD ["/usr/mtn/start.sh"]
