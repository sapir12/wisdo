FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src
COPY test ./test
COPY README.md ./README.md
COPY .env.example ./.env.example

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
