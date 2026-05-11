# ── Stage 1: Install all dependencies (for build) ────────────
FROM node:20-slim AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build Next.js ────────────────────────────────────
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

# Install SWI-Prolog from Debian repos
RUN apt-get update \
    && apt-get install -y --no-install-recommends swi-prolog \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
# Railway injects PORT automatically; Next.js standalone respects it.
# HOSTNAME ensures the server binds to 0.0.0.0, not just localhost.
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone output bundles only what's needed to run the server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prolog knowledge base files — loaded at runtime by the API routes
# process.cwd() in the container resolves to /app (WORKDIR)
COPY --from=builder --chown=nextjs:nodejs /app/base_conocimiento.pl ./base_conocimiento.pl
COPY --from=builder --chown=nextjs:nodejs /app/base_reglas.pl ./base_reglas.pl

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
