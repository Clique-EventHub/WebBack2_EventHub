FROM node
RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app
EXPOSE 1111
RUN npm install 
RUN npm install -g pm2 -g
CMD ["pm2-docker","server.js"]
