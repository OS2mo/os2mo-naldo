FROM node:16-alpine AS base

WORKDIR /app/web

COPY web/package.json web/yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY web .

# --- DEV ---
FROM base as dev

CMD yarn dev --host

# --- BUILD ---
FROM base as build

RUN yarn build

# --- PROD ---
FROM nginx:1.19-alpine AS prod

COPY --from=build /app/web/build /usr/share/nginx/html/