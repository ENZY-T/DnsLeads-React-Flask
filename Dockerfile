#For React App
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
#Setting the env to production
ENV NODE_ENV production



#For Nginx Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]


