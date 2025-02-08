FROM node:20.9.0-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm i

# hot reload
RUN apk --update --no-cache add curl 

COPY ./tsconfig.json ./tsconfig.json
COPY ./next.config.ts ./next.config.ts
COPY ./tailwind.config.ts ./tailwind.config.ts
COPY ./postcss.config.mjs ./postcss.config.mjs
COPY ./public ./public
COPY ./src ./src

CMD npm run dev
