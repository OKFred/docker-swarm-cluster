# Use Node.js image
FROM registry.cn-hangzhou.aliyuncs.com/one-registry/node:latest

# 设置工作目录
WORKDIR /app

# 复制 package 文件并安装依赖
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

# 复制所有源代码
COPY . .

# 执行启动命令
CMD ["pnpm", "run" ,"start"]