FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# Production
FROM node:20-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]