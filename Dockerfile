FROM ubuntu
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone git://github.com/DuoSoftware/DVP-SystemRegistry.git /usr/local/src/systemregistry
RUN cd /usr/local/src/systemregistry; npm install
CMD ["nodejs", "/usr/local/src/systemregistry/app.js"]

EXPOSE 8826