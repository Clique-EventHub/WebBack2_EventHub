FROM node
RUN mkdir -p /usr/app
COPY . /usr/app
WORKDIR /usr/app
EXPOSE 1111
RUN npm update
CMD ["npm","start"]
