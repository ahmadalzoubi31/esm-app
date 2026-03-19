FROM node:20-alpine AS base
RUN npm install -g turbo
WORKDIR /app

# ---- Prune monorepo to only api-relevant packages ----
FROM base AS pruner
COPY . .
RUN turbo prune api --docker

# ---- Install dependencies from pruned lockfile ----
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN npm ci

# ---- Build the app ----
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN npx turbo run build --filter=api

# ---- Production runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json .
RUN npm install --omit=dev

EXPOSE 5000
CMD ["node", "dist/main.js"]