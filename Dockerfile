FROM ubuntu:latest

RUN apt-get update

# Install imagemagick
RUN apt-get install -y imagemagick

# Install Node JS
RUN apt-get install -y nodejs \
&& apt-get install -y npm && ln -s /usr/bin/nodejs /usr/bin/node
ADD ./app/package.json /usr/mtn/app/package.json
RUN npm --prefix /usr/mtn/app install
EXPOSE 3000

WORKDIR /usr/mtn
ADD ./app /usr/mtn/app
ADD ./start.sh /usr/mtn/start.sh
ADD ./secrets.json /usr/mtn/secrets.json

RUN chmod +x /usr/mtn/start.sh
CMD ["/usr/mtn/start.sh"]
