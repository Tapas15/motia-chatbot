# Railway Dockerfile - Runs both backend and frontend in a single container
FROM node:20-alpine AS builder-backend

WORKDIR /app/backend

# Copy backend files
COPY backend/package*.json ./
COPY backend/steps ./steps
COPY backend/tsconfig.json ./
COPY backend/types.d.ts ./
COPY backend/public ./public

# Install dependencies
RUN npm install

# Build the backend
RUN npm run build


FROM node:20-alpine AS builder-frontend

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY frontend/public ./public
COPY frontend/src ./src

# Build the React application
RUN npm run build


FROM node:20-alpine AS production

WORKDIR /app

# Copy backend files
COPY --from=builder-backend /app/backend/package*.json ./backend/
COPY --from=builder-backend /app/backend/node_modules ./backend/node_modules
COPY --from=builder-backend /app/backend/dist ./backend/dist
COPY --from=builder-backend /app/backend/tsconfig.json ./backend/
COPY --from=builder-backend /app/backend/types.d.ts ./backend/
COPY --from=builder-backend /app/backend/steps ./backend/steps
COPY --from=builder-backend /app/backend/public ./backend/public

# Copy frontend files
COPY --from=builder-frontend /app/frontend/build ./frontend/build

# Install nginx and gettext (for envsubst)
RUN apk add --no-cache nginx gettext

# Copy nginx configuration and replace PORT variable
COPY frontend/nginx.conf /tmp/nginx.conf
RUN envsubst '${PORT}' < /tmp/nginx.conf > /etc/nginx/http.d/default.conf

# Create nginx working directories
RUN mkdir -p /run/nginx

# Set environment
ENV NODE_ENV=production

# Railway automatically sets PORT environment variable
# We'll use the PORT variable for backend
EXPOSE ${PORT:-3001} 8080

# Start both backend and nginx
CMD sh -c "cd /app/backend && PORT=${PORT:-3001} npm run start:prod & nginx -g 'daemon off;'"
