# Stage 1: Build
FROM node:18-bullseye-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build  # assumes your tsconfig outputs to /app/dist

# Stage 2: Production
FROM node:18-bullseye-slim

WORKDIR /app

# Copy compiled JS and package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/server.js"]
