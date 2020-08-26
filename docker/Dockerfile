FROM node:12.16.1-slim

# MAJ
RUN apt update && apt -y upgrade 

# Paquets utiles 
RUN apt install -y git inotify-tools libjson-perl

# Installation de access-lib 
WORKDIR /home/docker/
RUN git clone https://github.com/IGNF/geoportal-sdk.git
WORKDIR /home/docker/geoportal-sdk
# TO DELETE
RUN git checkout feature-docker

# Copie des scripts 
COPY ./docker/scripts/* /home/docker/

# Volume pour partager les samples 
VOLUME ["/home/docker/html/geoportal-sdk"]

CMD bash /home/docker/start.sh
