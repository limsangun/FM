# #Build stage
# FROM node:15-alpine AS builder

# ARG SERVER_URL

# WORKDIR /app

# #package 부터 추가.
# #module 다운로드 캐싱.
# COPY package.json package.json
# COPY package-lock.json package-lock.json

# RUN npm install --production

# #module 다운로드 후 src 추가.
# COPY . .


# RUN	REACT_APP_SERVER_URL=${SERVER_URL} npm run build


#Deploy stage
FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

WORKDIR /usr/share/nginx/html

RUN rm -rf *

# COPY --from=builder /app/build .
COPY build .

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]