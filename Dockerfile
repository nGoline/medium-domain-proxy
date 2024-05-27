FROM node:19.0.0-alpine3.16 as builder

# ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

FROM gcr.io/distroless/nodejs18-debian11

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist/index.js /app/index.js

WORKDIR /app

STOPSIGNAL SIGTERM

EXPOSE 80 443

CMD ["index.js"]