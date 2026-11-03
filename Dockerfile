FROM node:24-alpine

# build tools for any dependency that has to compile a native module
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src

# install first so the layer is reused while only the source changes.
# --ignore-scripts skips `nuxt prepare`, which needs the source; `nuxt dev` runs it on start.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

COPY . .

# 3000: dev server, 24678: Vite hot reload
EXPOSE 3000 24678
CMD ["yarn", "dev", "--host", "0.0.0.0"]
