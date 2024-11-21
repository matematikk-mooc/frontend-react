FROM node:20-alpine AS builder

ARG SENTRY_DSN
ARG APP_ENV

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SENTRY_DSN=${SENTRY_DSN}
ENV APP_ENV=${APP_ENV}

WORKDIR /app

RUN apk add --no-cache libc6-compat libjpeg-turbo-dev libpng-dev giflib-dev
RUN apk add --no-cache python3 make g++ build-base
RUN apk add --no-cache ca-certificates && update-ca-certificates
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN NODE_ENV=development pnpm install --frozen-lockfile

COPY . .
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) pnpm run build

# ---

FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN apk add --no-cache libc6-compat libjpeg-turbo-dev libpng-dev giflib-dev
RUN apk add --no-cache ca-certificates && update-ca-certificates
RUN npm install -g pnpm

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/locales.mjs ./
COPY --from=builder /app/next-i18next.config.js ./

RUN pnpm install --prod

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 8080
CMD ["pnpm", "start"]
