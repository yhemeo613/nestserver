# NestJS Microservice Architecture / NestJS 微服务架构

[English Documentation](#english-documentation) | [中文文档](#中文文档)

---

## <a id="中文文档">中文文档</a>

### 📖 简介

这是一个基于 **NestJS** 的高性能微服务架构模板，集成了 **MySQL** 和 **Redis**。它提供了一套完整的企业级开发最佳实践，包括用户认证、权限管理、任务队列、健康检查、日志记录和监控等功能。

### ✨ 主要特性

- **用户认证与授权**: 集成 JWT (Access Token + Refresh Token) 和 RBAC (基于角色的访问控制)。
- **数据库 ORM**: 使用 TypeORM 管理 MySQL 数据库，支持迁移 (Migration) 和种子数据 (Seeding)。
- **缓存与锁**: 集成 Redis 缓存，提供分布式锁服务 (`RedisLockService`)。
- **任务队列**: 使用 Bull 处理异步任务和消息队列。
- **定时任务**: 支持 Cron 定时任务调度。
- **安全防护**: 集成 Helmet、Rate Limiting (限流) 和 CORS 配置。
- **日志系统**: 使用 Winston 实现结构化日志，支持日志轮转。
- **监控与健康检查**: 集成 Prometheus 指标监控和 Terminus 健康检查。
- **API 文档**: 自动生成 Swagger/OpenAPI 文档。
- **容器化**: 提供 Docker 和 Docker Compose 配置，一键启动开发环境。

### 🛠 技术栈

- **框架**: NestJS (Node.js)
- **语言**: TypeScript
- **数据库**: MySQL 8.0
- **缓存/队列**: Redis 7.0
- **ORM**: TypeORM
- **包管理**: pnpm

### 📋 前置要求

- Node.js (v16+)
- pnpm (推荐) 或 npm
- MySQL Server
- Redis Server

### 🚀 安装与运行

#### 1. 克隆项目

```bash
git clone <repository-url>
cd nest-server
```

#### 2. 安装依赖

```bash
pnpm install
```

#### 3. 配置环境变量

复制示例配置文件并重命名为 `.env`：

```bash
cp .env.example .env
```

修改 `.env` 文件中的数据库和 Redis 配置以匹配你的本地环境。

#### 4. 运行数据库迁移和种子数据

```bash
# 生成迁移文件（如有修改实体）
pnpm migration:generate src/database/migrations/NewMigrationName

# 运行迁移
pnpm migration:run

# 填充初始数据（种子数据）
pnpm seed
```

#### 5. 启动应用

```bash
# 开发模式
pnpm start:dev

# 生产模式
pnpm build
pnpm start:prod
```

### 📚 API 文档

启动应用后，访问以下地址查看 Swagger 文档：
http://localhost:3000/api/docs

### 🧪 测试

```bash
# 单元测试
pnpm test

# 单元测试 (覆盖率)
pnpm test:cov

# 端到端测试
pnpm test:e2e
```

### 📂 目录结构

```
src/
├── common/          # 通用模块 (装饰器, 过滤器, 拦截器, 服务)
├── config/          # 配置文件
├── database/        # 数据库相关 (迁移, 种子)
├── modules/         # 业务模块
│   ├── auth/        # 认证模块
│   ├── users/       # 用户模块
│   ├── roles/       # 角色模块
│   ├── permissions/ # 权限模块
│   ├── tasks/       # 定时任务
│   ├── queue/       # 队列处理
│   └── health/      # 健康检查
└── main.ts          # 入口文件
```

---

## <a id="english-documentation">English Documentation</a>

### 📖 Introduction

This is a high-performance microservice architecture template based on **NestJS**, integrated with **MySQL** and **Redis**. It provides a complete set of enterprise-level best practices, including user authentication, permission management, task queues, health checks, logging, and monitoring.

### ✨ Key Features

- **Authentication & Authorization**: JWT integration (Access Token + Refresh Token) and RBAC (Role-Based Access Control).
- **Database ORM**: TypeORM for MySQL management, supporting Migrations and Seeding.
- **Caching & Locking**: Redis cache integration and distributed lock service (`RedisLockService`).
- **Task Queue**: Asynchronous task processing using Bull.
- **Scheduled Tasks**: Cron job scheduling support.
- **Security**: Integrated Helmet, Rate Limiting, and CORS configuration.
- **Logging**: Structured logging with Winston, supporting log rotation.
- **Monitoring & Health**: Prometheus metrics and Terminus health checks.
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation.
- **Containerization**: Docker and Docker Compose configuration for easy setup.

### 🛠 Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **Cache/Queue**: Redis 7.0
- **ORM**: TypeORM
- **Package Manager**: pnpm

### 📋 Prerequisites

- Node.js (v16+)
- pnpm (recommended) or npm
- MySQL Server
- Redis Server

### 🚀 Installation & Running

#### 1. Clone the repository

```bash
git clone <repository-url>
cd nest-server
```

#### 2. Install dependencies

```bash
pnpm install
```

#### 3. Configure Environment Variables

Copy the example configuration file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file to match your local MySQL and Redis configuration.

#### 4. Run Migrations and Seeds

```bash
# Generate migration (if entities changed)
pnpm migration:generate src/database/migrations/NewMigrationName

# Run migrations
pnpm migration:run

# Seed initial data
pnpm seed
```

#### 5. Start the Application

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod
```

### 📚 API Documentation

Once the application is running, access the Swagger documentation at:
http://localhost:3000/api/docs

### 🧪 Testing

```bash
# Unit tests
pnpm test

# Unit tests (coverage)
pnpm test:cov

# E2E tests
pnpm test:e2e
```

### 📂 Directory Structure

```
src/
├── common/          # Common modules (Decorators, Filters, Interceptors, Services)
├── config/          # Configurations
├── database/        # Database related (Migrations, Seeds)
├── modules/         # Business Modules
│   ├── auth/        # Authentication
│   ├── users/       # User Management
│   ├── roles/       # Role Management
│   ├── permissions/ # Permission Management
│   ├── tasks/       # Scheduled Tasks
│   ├── queue/       # Queue Processing
│   └── health/      # Health Checks
└── main.ts          # Entry Point
```

## 📄 License

This project is licensed under the MIT License.
