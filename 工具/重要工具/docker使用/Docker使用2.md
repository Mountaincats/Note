Docker 是一个开源的容器化平台，能让你将应用程序及其依赖打包成一个可移植的容器，在任何支持 Docker 的环境中运行。我会从基础用法、Dockerfile 编写、环境指定三个核心维度，用新手友好的方式讲解。

### 一、Docker 基础用法（先掌握核心流程）
#### 1. 前置条件
首先确保你已经安装了 Docker（Docker Desktop 适合Windows/macOS，Docker Engine 适合Linux），安装后通过终端验证：
```bash
docker --version  # 查看版本
docker info       # 查看Docker状态
docker run hello-world  # 运行测试容器，验证安装成功
```
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```
#### 2. Docker 核心命令（新手高频使用）
| 命令 | 作用 |
|------|------|
| `docker pull [镜像名]` | 从仓库拉取镜像（如 `docker pull ubuntu:22.04`） |
| `docker build -t [自定义镜像名:版本] .` | 基于Dockerfile构建镜像（`.` 表示Dockerfile在当前目录） |
| `docker run [参数] [镜像名]` | 运行容器（如 `docker run -it ubuntu:22.04 /bin/bash`） |
| `docker ps` | 查看运行中的容器 |
| `docker images` | 查看本地镜像 |
| `docker stop [容器ID/名称]` | 停止容器 |
| `docker rm [容器ID/名称]` | 删除容器 |
| `docker rmi [镜像ID/名称]` | 删除镜像 |
| `docker exec [容器ID/名称]` | 进入后台运行的容器|

### 二、Dockerfile 怎么写（核心重点）
Dockerfile 是一个**纯文本文件**，包含一系列指令，用于告诉 Docker 如何构建镜像。每个指令对应镜像构建的一个步骤，最终生成可运行的容器环境。

#### 1. Dockerfile 基本结构（以Python应用为例）
先看一个完整的示例（保存为 `Dockerfile`，无后缀）：
```dockerfile
# 1. 指定基础镜像（核心：环境的基础来源）
FROM python:3.10-slim

# 2. 设置工作目录（可选，规范容器内的工作路径）
WORKDIR /app

# 3. 复制本地文件到容器（如依赖文件、代码）
COPY requirements.txt .
COPY app.py .

# 4. 安装依赖（根据应用需求执行命令）
RUN pip install --no-cache-dir -r requirements.txt

# 5. 设置环境变量（指定运行时环境）
ENV PYTHONUNBUFFERED=1
ENV APP_ENV=production

# 6. 暴露端口（告诉Docker容器监听的端口，仅声明，不实际映射）
EXPOSE 8000

# 7. 容器启动时执行的命令
CMD ["python", "app.py"]
```

#### 2. Dockerfile 核心指令详解（新手必懂）
| 指令 | 作用 | 示例 |
|------|------|------|
| `FROM` | **指定基础镜像**（环境的核心，必须是第一条非注释指令） | `FROM ubuntu:22.04`（Linux基础）、`FROM node:18`（Node.js环境） |
| `WORKDIR` | 设置容器内的工作目录（后续命令都在此目录执行） | `WORKDIR /app` |
| `COPY` | 从本地复制文件/目录到容器 | `COPY . /app`（复制当前目录所有文件到容器/app） |
| `ADD` | 类似COPY，但支持下载远程文件、解压压缩包 | `ADD https://xxx.tar.gz /app` |
| `RUN` | 构建镜像时执行的命令（如安装软件、依赖） | `RUN apt update && apt install -y nginx` |
| `ENV` | 设置环境变量（运行时生效，可在容器内读取） | `ENV MYSQL_ROOT_PASSWORD=123456` |
| `EXPOSE` | 声明容器暴露的端口（仅说明，需run时-p映射） | `EXPOSE 80` |
| `CMD` | 容器启动时执行的命令（只能有一个，被run参数覆盖） | `CMD ["nginx", "-g", "daemon off;"]` |
| `ENTRYPOINT` | 容器启动的固定命令（不会被覆盖，可搭配CMD传参） | `ENTRYPOINT ["python"]` + `CMD ["app.py"]` |

### 三、如何指定生成的环境（关键）
Docker 镜像的环境完全由 `FROM` 指令（基础镜像）+ 后续指令（安装依赖、配置）决定，核心有两种方式：

#### 1. 直接使用官方基础镜像（最推荐，新手优先）
Docker Hub 提供了各种预配置好的官方镜像，直接指定即可快速获得对应环境：
- **基础Linux环境**：`FROM ubuntu:20.04`、`FROM centos:7`、`FROM alpine:3.18`（轻量级）
- **编程语言环境**：`FROM python:3.9`、`FROM java:8`、`FROM golang:1.20`
- **框架/工具环境**：`FROM nginx:1.24`、`FROM mysql:8.0`、`FROM redis:7.0`

示例（指定Python 3.10 + Alpine轻量环境）：
```dockerfile
# 基础环境：Python 3.10 + Alpine Linux（体积小，适合生产）
FROM python:3.10-alpine

# 安装Alpine特有的依赖（弥补基础镜像的缺失）
RUN apk add --no-cache gcc musl-dev

# 设置环境变量
ENV PYTHONPATH=/app
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

#### 2. 基于基础镜像自定义环境（按需扩展）
如果官方镜像不满足需求，可基于最基础的Linux镜像（如alpine、ubuntu）手动安装环境：

示例（从空白Ubuntu构建Node.js 18环境）：
```dockerfile
# 基础环境：Ubuntu 22.04
FROM ubuntu:22.04

# 安装Node.js 18（手动指定环境版本）
RUN apt update && apt install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt install -y nodejs \
    && rm -rf /var/lib/apt/lists/*  # 清理缓存，减小镜像体积

# 验证Node版本
RUN node -v  # 输出v18.x.x
RUN npm -v

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### 3. 环境变量的精细化配置
通过 `ENV` 指令可以进一步定制运行环境：
```dockerfile
# 指定Python运行环境
ENV PYTHONUNBUFFERED=1  # 关闭Python缓冲，日志实时输出
ENV DJANGO_SETTINGS_MODULE=myproject.settings.prod  # Django生产环境配置
ENV PATH="/app/bin:${PATH}"  # 追加自定义路径到系统PATH

# 指定Java环境
FROM openjdk:8
ENV JAVA_OPTS="-Xms512m -Xmx1024m"  # JVM内存配置
ENV SPRING_PROFILES_ACTIVE=prod  # SpringBoot生产环境
```

### 四、完整实操示例（从编写到运行）
#### 1. 准备文件
- 本地创建目录，包含：
  - `Dockerfile`（内容如下）
  - `app.py`（简单Python脚本）
```python
# app.py
import os
print(f"Hello Docker! App ENV: {os.getenv('APP_ENV')}")
```

#### 2. Dockerfile 内容
```dockerfile
# 指定基础环境：Python 3.10-slim（精简版，体积小）
FROM python:3.10-slim

# 设置工作目录
WORKDIR /app

# 复制本地app.py到容器
COPY app.py .

# 设置环境变量
ENV APP_ENV=production

# 启动命令
CMD ["python", "app.py"]
```

#### 3. 构建并运行
```bash
# 构建镜像（-t 给镜像命名为my-docker-app，版本为v1）
docker build -t my-docker-app:v1 .

# 运行容器
docker run my-docker-app:v1
```

#### 4. 输出结果
```
Hello Docker! App ENV: production
```

### 总结
1. **Docker 核心流程**：编写Dockerfile → 构建镜像（docker build）→ 运行容器（docker run）。
2. **Dockerfile 核心**：`FROM` 指令指定基础环境（官方镜像优先），`RUN` 安装依赖，`CMD` 定义启动命令。
3. **环境指定方式**：① 直接用官方预配置镜像（如python:3.10）；② 基于基础Linux镜像手动安装所需环境；③ 通过`ENV`指令配置运行时环境变量。

新手建议先从官方基础镜像入手，熟悉后再根据需求自定义环境，重点注意镜像体积（优先用alpine版本）和命令的分层（减少镜像层数，提高构建效率）。