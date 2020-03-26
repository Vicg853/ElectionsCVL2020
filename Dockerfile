FROM node:11

RUN mkdir -p /api
WORKDIR /api

COPY package*.json ./
COPY ./entry.sh /
COPY . /api/

RUN npm i

VOLUME /api

EXPOSE 4001

RUN chmod +x /entry.sh
ENTRYPOINT ["/entry.sh"]
