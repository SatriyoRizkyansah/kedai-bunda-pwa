FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json
COPY apps/web/package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && npm install react-is@18 --save --legacy-peer-deps

# Copy source code
COPY apps/web .

# Build argument for API URL
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
