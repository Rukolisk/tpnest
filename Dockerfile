FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]