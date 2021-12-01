FROM phusion/baseimage:master-amd64

ARG SETHEUM_NODE=v0.9.8

RUN apt-get update && apt-get install wget -y

WORKDIR /usr/local/bin

RUN wget https://github.com/Setheum-Labs/Setheum/releases/download/$SETHEUM_NODE/setheum-node

RUN chmod +x setheum-node

WORKDIR /data

EXPOSE 30333 9933 9944

VOLUME ["/data"]

ENTRYPOINT ["setheum-node"]
