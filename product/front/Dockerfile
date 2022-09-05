#Deploy stage
FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY build .

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]