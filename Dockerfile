# base image
FROM node:11


# set working directory
RUN mkdir -p /site
WORKDIR /site

COPY package*.json ./
COPY ./entry.sh /
COPY . /site/

RUN npm i
RUN npm i -g gatsby 
RUN npm i -g gatsby-cli

VOLUME /site

EXPOSE 9000

RUN chmod +x /entry.sh
ENTRYPOINT ["/entry.sh"]