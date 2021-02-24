FROM node:12

WORKDIR /usr/src/marvel-stone

ENV DB_HOST=0.0.0.0
ENV DB_PORT=0000
ENV DB_USERNAME=any_user
ENV DB_PASSWORD=any_user_password
ENV DB_DATABASE_NAME=any_name
ENV AUTHENTICATION_SECRET_KEY=any_key

COPY package.json .
COPY package-lock.json .

RUN ls
RUN npm ci
COPY ./dist ./dist

RUN ls -a

EXPOSE 3000/tcp
EXPOSE 3000/udp

CMD npm start


