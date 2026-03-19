FROM node:20-alpine AS base
RUN npm install -g turbo
WORKDIR /app

# ---- Prune monorepo to only web-relevant packages ----
FROM base AS pruner
COPY . .
RUN turbo prune web --docker

# ---- Install dependencies from pruned lockfile ----
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml  # 👈 changed
RUN npm install -g pnpm && pnpm install --frozen-lockfile     # 👈 changed
RUN npm ci

# ---- Build the app ----
FROM installer AS builder
COPY --from=pruner /app/out/full/ .
RUN npx turbo run build --filter=web

# ---- Production runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]