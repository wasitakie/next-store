FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN pnpm  build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts  
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma


USER root
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]