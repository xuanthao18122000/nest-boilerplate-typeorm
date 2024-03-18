FROM node:16.20.0-buster  as nodemodule
WORKDIR /app
COPY package.json ./package.json
RUN npm install

FROM node:16.20.0-buster  as builder
WORKDIR /app
COPY . .
COPY --from=nodemodule /app/node_modules ./node_modules
RUN npm run build


FROM node:16.20.0-buster  as runner
WORKDIR /app
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y tzdata
RUN unlink /etc/localtime
RUN ln -s /usr/share/zoneinfo/Asia/Bangkok /etc/localtime


COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/nest-cli.json ./nest-cli.json
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/run-container.sh ./run-container.sh
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json

COPY --from=nodemodule /app/node_modules ./node_modules

EXPOSE 3000

CMD ["/bin/sh", "run-container.sh"]
