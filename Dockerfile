# Docs: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache \
    # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
    libc6-compat \
    # The error is caused by missing a Python installation required by node-gyp during the build process.
    python3 make g++
WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN corepack enable pnpm && NODE_ENV=development pnpm i --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN corepack enable pnpm \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/locales.js ./
COPY --from=builder --chown=nextjs:nodejs /app/next-i18next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/next-i18next.config.d.ts ./

USER nextjs
EXPOSE 8080

CMD ["pnpm", "start"]
