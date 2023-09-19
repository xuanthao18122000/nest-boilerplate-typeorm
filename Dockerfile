# Sử dụng một base image từ Docker Hub có tên node:16.19.0-alpine.
FROM node:16.19.0-alpine as nodemodule
# Đặt thư mục làm việc trong container là /app
WORKDIR /app
# Sao chép file package.json từ thư mục hiện tại vào /app/package.json.
COPY package.json ./package.json
# Chạy lệnh npm install để cài đặt các dependencies từ package.json.
# Điều này tạo ra một lớp image tên là nodemodule chứa các node_modules đã cài đặt.
RUN npm install

# Tạo một lớp image mới từ base image node:16.19.0-alpine, và tiếp tục làm việc trong thư mục /app
FROM node:16.19.0-alpine as builder
# Tiếp tục làm việc trong thư mục /app.
WORKDIR /app
# Sao chép toàn bộ mã nguồn ứng dụng (bạn đã có file Dockerfile ở thư mục hiện tại) vào /app
COPY . .
# Sao chép các node_modules từ lớp image nodemodule vào /app/node_modules.
COPY --from=nodemodule /app/node_modules ./node_modules
# Chạy lệnh npm run build để tạo ra các tệp tin build của ứng dụng.
RUN npm run build

FROM node:16.19.0-alpine as runner
WORKDIR /app

# Thực hiện một số thao tác để cài đặt múi giờ cho hệ thống (setup-timezone -z Asia/Bangkok).
RUN apk add --no-cache alpine-conf && \
  setup-timezone -z Asia/Bangkok

# Sao chép các tệp và thư mục từ lớp image builder vào /app. 
# Các tệp bao gồm tệp build của ứng dụng, package.json, .env, run-container.sh, tsconfig.json, và tsconfig.build.json.
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/nest-cli.json ./nest-cli.json
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/run-container.sh ./run-container.sh
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json

# Sao chép lại các node_modules từ lớp image nodemodule để đảm bảo rằng ứng dụng có thể chạy.
COPY --from=nodemodule /app/node_modules ./node_modules

# Mở cổng 3000 trên container.
EXPOSE 3000

CMD ["/bin/sh", "run-container.sh"]
