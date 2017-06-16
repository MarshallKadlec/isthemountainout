FROM ubuntu:latest

# Install Node JS
RUN apt-get update && apt-get install -y nodejs \
&& apt-get install -y npm && ln -s /usr/bin/nodejs /usr/bin/node
ADD ./app/package.json /usr/ott/app/package.json
RUN npm --prefix /usr/ott/app install
EXPOSE 3000

WORKDIR /usr/ott
ADD ./app /usr/ott/app
ADD ./ngrok /usr/ott/ngrok
ADD ./start.sh /usr/ott/start.sh

RUN chmod +x /usr/ott/ngrok/ngrok && chmod +x /usr/ott/start.sh
CMD ["/usr/ott/start.sh"]
