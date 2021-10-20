FROM node:14-alpine

RUN apk update && \
    apk add --no-cache vim \
    sudo
