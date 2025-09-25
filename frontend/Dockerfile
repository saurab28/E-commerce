# Use Node 22 for development
FROM node:22-bullseye-slim AS development

WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies (devDependencies included)
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Expose Vite's default dev server port
EXPOSE 80

# Start development server with hot-reloading
CMD ["npm", "run", "dev"]
