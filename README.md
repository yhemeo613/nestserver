# NestJS Microservice Architecture / NestJS 微服务架构

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![NestJS](https://img.shields.io/badge/nestjs-%5E10.0.0-red.svg) ![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg) ![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

[English Documentation](#english-documentation) | [中文文档](#中文文档)

---

<a id="中文文档"></a>

## 📖 项目概述

这是一个基于 **NestJS** 构建的高性能微服务架构模板，专为追求可扩展性和可维护性的企业级应用设计。项目深度集成了 **MySQL** 持久层和 **Redis** 缓存/消息队列，提供了一套开箱即用的最佳实践方案。

**目标与愿景**：本项目旨在解决从零搭建微服务基础设施的繁琐问题，为开发者提供一个安全、高效且易于扩展的后端基座。它非常适合需要快速启动后端服务、对代码质量有高要求以及希望学习 NestJS 高级特性的开发者和团队。

## ✨ 功能特性

- 🔐 **企业级认证授权**
    - 集成 **JWT** (Access/Refresh Token) 双令牌机制，实现无感刷新与安全认证。
    - 内置 **RBAC** (Role-Based Access Control) 权限模型，支持细粒度的接口与资源权限控制。

- 💾 **高效数据管理**
    - 基于 **TypeORM** 的数据持久化，完美支持 MySQL 8.0+。
    - 提供完整的数据库 **迁移 (Migration)** 和 **种子数据 (Seeding)** 流程，确保数据库版本可控与环境一致性。

- 🚀 **高性能缓存与队列**
    - 深度集成 **Redis**，提供高性能缓存策略，大幅提升响应速度。
    - 封装 `RedisLockService` **分布式锁**，有效解决并发操作下的数据一致性问题。
    - 基于 **Bull** 的异步任务队列，轻松处理耗时任务、邮件发送及系统解耦。

- 🛡️ **全方位安全防护**
    - 集成 **Helmet** 增强 HTTP 头安全，防御常见 Web 攻击。
    - 内置 **Rate Limiting** (限流) 机制，防止恶意刷接口与 DDoS 攻击。
    - 完善的 **CORS** 配置和基于 `class-validator` 的输入参数校验。

- 📊 **监控与可观测性**
    - 集成 **Winston** 结构化日志系统，支持按天轮转与多级别输出。
    - 内置 **Prometheus** 指标监控端点，便于接入 Grafana 等监控面板。
    - 提供 **Terminus** 健康检查接口，实时监控应用、数据库及 Redis 状态。

- 🐳 **DevOps 友好**
    - 提供完整的 **Docker** 和 **Docker Compose** 配置，一键拉起开发环境。
    - 自动生成 **Swagger/OpenAPI** 接口文档，便于前后端协作。

## 🚀 快速开始

### 环境要求

- **Node.js**: v16+
- **pnpm**: 推荐使用 (或 npm/yarn)
- **MySQL**: 8.0+
- **Redis**: 7.0+

### 安装步骤

1.  **克隆项目**

    ```bash
    git clone <repository-url>
    cd nest-server
    ```

2.  **安装依赖**

    ```bash
    pnpm install
    ```

3.  **配置环境**
    复制环境变量示例文件：

    ```bash
    cp .env.example .env
    ```

    _请务必修改 `.env` 文件，填入您本地的数据库和 Redis 连接信息。_

4.  **初始化数据库**

    ```bash
    # 运行数据库迁移，构建表结构
    pnpm migration:run

    # 填充初始种子数据（管理员账号等）
    pnpm seed
    ```

5.  **启动应用**

    ```bash
    # 开发模式 (支持热更新)
    pnpm start:dev

    # 生产模式
    pnpm build
    pnpm start:prod
    ```

## � 使用指南

### 基础配置

项目核心配置位于 `.env` 文件中，支持动态调整，无需修改代码：

- `PORT`: 服务端口 (默认 3000)
- `DB_*`: MySQL 数据库连接配置
- `REDIS_*`: Redis 连接配置
- `JWT_*`: 密钥与过期时间设置
- `LOG_LEVEL`: 日志级别控制

### 分布式锁使用示例

在业务服务中注入 `RedisLockService` 以处理并发敏感操作：

```typescript
import { RedisLockService } from '@/common/services/redis-lock.service';

constructor(private readonly redisLockService: RedisLockService) {}

async criticalTask() {
    const lockKey = 'resource:unique-id';
    // 尝试获取锁，TTL 30秒
    const acquired = await this.redisLockService.acquireLock(lockKey, 30);

    if (!acquired) {
        throw new Error('Resource is busy, please try again later.');
    }

    try {
        // 执行关键业务逻辑
        await this.doSomethingImportant();
    } finally {
        // 务必释放锁
        await this.redisLockService.releaseLock(lockKey);
    }
}
```

### 查看 API 文档

启动服务后，访问以下地址查看自动生成的交互式 Swagger 文档：
👉 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## 🤝 贡献指南

我们非常欢迎社区的贡献！如果您发现 Bug 或有新的功能建议，请遵循以下步骤：

1.  **提交 Issue**: 在开始工作前，请先提交一个 Issue 讨论您想要修改的内容。
2.  **Fork 本仓库**: 将项目 Fork 到您的 GitHub 账户。
3.  **创建分支**: `git checkout -b feature/AmazingFeature`
4.  **提交更改**: `git commit -m 'Add some AmazingFeature'` (请遵循 Commit 规范)
5.  **推送到分支**: `git push origin feature/AmazingFeature`
6.  **提交 PR**: 发起 Pull Request 到 `main` 分支。

### 开发环境设置

请确保代码风格符合项目规范：

```bash
# 运行 Lint 检查与修复
pnpm lint

# 运行单元测试
pnpm test
```

## 📄 许可证信息

本项目基于 **MIT 许可证** 开源。详情请参阅 [LICENSE](LICENSE) 文件。

---

<a id="english-documentation"></a>

## 📖 Project Overview

This is a high-performance microservice architecture template based on **NestJS**, designed for enterprise-level applications requiring scalability and maintainability. It deeply integrates **MySQL** for persistence and **Redis** for caching/queuing, providing an out-of-the-box best practice solution.

**Goal & Vision**: This project aims to solve the tedious process of building microservice infrastructure from scratch, offering developers a secure, efficient, and easily extensible backend foundation. It is perfect for developers and teams looking to quickly launch backend services, maintain high code quality, and leverage advanced NestJS features.

## ✨ Key Features

- 🔐 **Enterprise-Grade Auth**
    - **JWT** (Access/Refresh Token) mechanism for seamless and secure authentication.
    - Built-in **RBAC** (Role-Based Access Control) for granular permission management.

- 💾 **Efficient Data Management**
    - **TypeORM** based persistence supporting MySQL 8.0+.
    - Complete **Migration** and **Seeding** workflows to ensure database version control and consistency.

- 🚀 **High-Performance Cache & Queue**
    - Deep **Redis** integration for high-speed caching strategies.
    - Encapsulated `RedisLockService` **Distributed Lock** to handle concurrency and data consistency.
    - **Bull** based asynchronous task queue for background jobs and system decoupling.

- 🛡️ **Comprehensive Security**
    - **Helmet** integration for HTTP header security.
    - Built-in **Rate Limiting** to prevent brute-force and DDoS attacks.
    - **CORS** configuration and `class-validator` based input validation.

- 📊 **Monitoring & Observability**
    - **Winston** structured logging with daily rotation.
    - **Prometheus** metrics endpoint for monitoring.
    - **Terminus** health checks for real-time status of app, database, and Redis.

- 🐳 **DevOps Friendly**
    - Complete **Docker** and **Docker Compose** setup for one-click environment provisioning.
    - Auto-generated **Swagger/OpenAPI** documentation.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v16+
- **pnpm**: Recommended (or npm/yarn)
- **MySQL**: 8.0+
- **Redis**: 7.0+

### Installation

1.  **Clone Repository**

    ```bash
    git clone <repository-url>
    cd nest-server
    ```

2.  **Install Dependencies**

    ```bash
    pnpm install
    ```

3.  **Configure Environment**
    Copy the example env file:

    ```bash
    cp .env.example .env
    ```

    _Edit `.env` with your local database and Redis credentials._

4.  **Initialize Database**

    ```bash
    # Run migrations
    pnpm migration:run

    # Seed initial data
    pnpm seed
    ```

5.  **Start Application**

    ```bash
    # Development (Hot-reload)
    pnpm start:dev

    # Production
    pnpm build
    pnpm start:prod
    ```

## � Usage Guide

### Basic Configuration

Core configurations are managed in `.env`:

- `PORT`: Service port (default 3000)
- `DB_*`: Database connection settings
- `REDIS_*`: Redis connection settings
- `JWT_*`: Auth secrets and expiration
- `LOG_LEVEL`: Logging level

### API Documentation

Access the interactive Swagger UI at:
👉 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## 🤝 Contribution

Contributions are welcome!

1.  **Fork** the project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

## 📄 License

This project is licensed under the **MIT License**.
