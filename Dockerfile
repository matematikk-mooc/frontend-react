FROM node:20-alpine as builder

WORKDIR /app

RUN apk add --no-cache libc6-compat libjpeg-turbo-dev libpng-dev giflib-dev
RUN apk add --no-cache python3 make g++ build-base
RUN apk add --no-cache ca-certificates && update-ca-certificates
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ---

FROM node:20-alpine as runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

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

EXPOSE 3000
CMD ["pnpm", "start"]
