FROM node:20-alpine

# 必要なツールを追加
RUN apk update && \
    apk add --no-cache python3 make g++ vim sudo

# 作業ディレクトリ
WORKDIR /usr/src

# パッケージ情報をコピー
COPY package.json yarn.lock ./

# 依存インストール
RUN yarn install --frozen-lockfile || yarn install

# ソースコードをコピー
COPY . .

EXPOSE 3000
CMD ["yarn", "dev"]
