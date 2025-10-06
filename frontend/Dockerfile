FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# Только статика
FROM scratch AS production
COPY --from=builder /app/build /build