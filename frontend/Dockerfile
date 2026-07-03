# Frontend — development image (Vite dev server with HMR)
FROM node:24-alpine

WORKDIR /app

# Enable pnpm via corepack — pin to 9.x to match the lockfile (v9.0)
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Install dependencies first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Source is bind-mounted in dev (see docker-compose.yml), copied here as a fallback
COPY . .

EXPOSE 5173

# --host 0.0.0.0 makes the dev server reachable from outside the container
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
