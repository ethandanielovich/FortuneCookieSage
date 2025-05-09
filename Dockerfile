# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy and build everything
COPY . .
RUN npm run build

# 2) Runtime stage
FROM node:20-alpine
WORKDIR /app

# Copy built assets and production deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

# Start the server (picks up $PORT)
CMD ["node", "dist/index.js"]
