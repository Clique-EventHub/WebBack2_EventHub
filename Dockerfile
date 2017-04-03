FROM node
RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app
EXPOSE 1111
RUN npm update
RUN npm install pm2 -g
CMD ["pm2-docker","server.js"]
