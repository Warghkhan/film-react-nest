FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev @rollup/rollup-linux-x64-musl
COPY . .
RUN npm run build