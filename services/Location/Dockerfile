# Stage 1: Build
FROM node:18-bullseye-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build  # compile TS

# Stage 2: Production
FROM node:18-bullseye-slim

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 4001
CMD ["node", "dist/index.js"]
