FROM node:14.19.3-bullseye-slim


COPY . /app
WORKDIR /app

RUN npm install


EXPOSE 8080


USER nobody
CMD [ "node", "server.js" ]
