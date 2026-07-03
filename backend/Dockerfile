# Backend — development image (hot-reload via nodemon)
FROM node:24-alpine

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Source is bind-mounted in dev (see docker-compose.yml), copied here as a fallback
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
