FROM node

RUN mkdir -p /usr/app
ADD . /usr/app/
WORKDIR /usr/app/

RUN apt-get update
RUN npm install 
RUN npm install -g pm2
EXPOSE 1111

CMD ["pm2-docker","server.js"]
