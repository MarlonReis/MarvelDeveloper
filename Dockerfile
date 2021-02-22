FROM node:12

WORKDIR /usr/src/marvel-stone

COPY package.json .
COPY package-lock.json .
COPY .env .

RUN ls
RUN npm install --only=prod
COPY ./dist ./dist

RUN ls -a

EXPOSE 3000

CMD npm start
