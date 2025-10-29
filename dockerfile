FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push --skip-generate && npx tsx src/config/server.ts"]