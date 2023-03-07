#For React App
FROM node:18-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
#Setting the env to production
ENV NODE_ENV production

RUN npm run build


#For Nginx Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]


