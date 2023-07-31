FROM node as build
WORKDIR /app

RUN rm -rf /node_modules

COPY package.json .

RUN yarn install
COPY . .
RUN yarn build

FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
