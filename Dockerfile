FROM node:25-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json next.config.* ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:25-alpine as production
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Very important when using standalone output
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]