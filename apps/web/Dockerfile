# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine3.20 AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
COPY apps/web/package.json ./apps/web/
RUN yarn --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

# Set up the web app working directory
WORKDIR /app/apps/web

# Set NODE_PATH to include both node_modules directories
ENV NODE_PATH=/app/node_modules:/app/apps/web/node_modules

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# RUN yarn add next
RUN yarn add @vercel/blob
RUN yarn run build

# # Final production image with NGINX
# FROM nginx:alpine

# # Install envsubst utility
# RUN apk add --no-cache gettext

# # Copy NGINX configuration as a template
# COPY apps/web/nginx.conf /etc/nginx/nginx.conf.template

# # Copy the entrypoint script
# COPY apps/web/docker-entrypoint.sh /docker-entrypoint.sh
# RUN chmod +x /docker-entrypoint.sh

# # Create a directory structure for the Next.js static files
# WORKDIR /usr/share/nginx/html

# # Copy the standalone Next.js build
# COPY --from=builder /app/apps/web/.next/standalone/. ./
# COPY --from=builder /app/apps/web/.next/static ./_next/static/
# COPY --from=builder /app/apps/web/public ./public/

# # Expose port 80
# EXPOSE 80

# # Use entrypoint script to substitute environment variables
# ENTRYPOINT ["/docker-entrypoint.sh"]

# Production image, copy all the files and run next
FROM base AS runner
# Install NGINX and other utilities
RUN apk add --no-cache nginx gettext supervisor
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone/. ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

COPY --from=builder /app/apps/web/public ./public

# Copy NGINX configuration and entrypoint
COPY apps/web/nginx.conf /etc/nginx/nginx.conf.template
COPY apps/web/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create supervisord configuration
RUN echo "[supervisord]" > /etc/supervisor/conf.d/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "[program:node]" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "command=node apps/web/server.js" >> /etc/supervisor/conf.d/supervisord.conf

# Expose port for NGINX
EXPOSE 80

# Start both services using supervisord
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# ENV NODE_ENV=production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED=1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# COPY --from=builder /app/apps/web/public ./apps/web/public

# USER nextjs

# EXPOSE 3000

# ENV PORT=3000

# # server.js is created by next build from the standalone output
# # https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
# ENV HOSTNAME="0.0.0.0"
# CMD ["node", "apps/web/server.js"]
