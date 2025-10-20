
FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || true
COPY . .
RUN npm run build || true

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
