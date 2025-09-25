# Use official Node.js image
FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4001
CMD ["node", "index.js"]
