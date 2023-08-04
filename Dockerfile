FROM node:14 as build

WORKDIR /app
COPY . /app

RUN yarn install
RUN yarn run build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]


