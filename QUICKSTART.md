# 快速开始指南

本指南将帮助您快速启动和运行NestJS微服务架构项目。

## 前置要求

确保您的系统已安装以下软件：

- **Node.js** >= 20.x ([下载地址](https://nodejs.org/))
- **npm** >= 9.x (随Node.js一起安装)
- **Docker** >= 20.x ([下载地址](https://www.docker.com/get-started))
- **Docker Compose** >= 2.x

## 快速启动步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

根据您的需求编辑 `.env` 文件中的配置。默认配置已经可以用于本地开发。

### 3. 启动数据库服务

使用Docker Compose启动MySQL和Redis：

```bash
docker-compose up -d mysql redis
```

等待服务启动完成（大约30秒）。

### 4. 运行数据库迁移

创建数据库表结构：

```bash
npm run migration:run
```

### 5. 运行种子数据（可选）

插入初始测试数据：

```bash
npm run seed
```

这将创建：
- 2个用户：admin@example.com (密码: admin123) 和 test@example.com (密码: admin123)
- 2个角色：admin 和 user
- 6个权限

### 6. 启动应用

启动开发服务器（支持热重载）：

```bash
npm run start:dev
```

应用将在 `http://localhost:3000` 启动。

### 7. 访问API文档

打开浏览器访问Swagger文档：

```
http://localhost:3000/api/v1/docs
```

## 测试API

### 1. 用户注册

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

### 2. 用户登录

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

响应示例：
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "user-id-here"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 3. 访问受保护的API

使用登录返回的accessToken：

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. 健康检查

```bash
curl http://localhost:3000/api/v1/health
```

## 常用命令

### 开发命令

```bash
# 启动开发服务器（热重载）
npm run start:dev

# 启动调试服务器
npm run start:debug

# 代码格式化
npm run format

# 代码检查
npm run lint
```

### 数据库命令

```bash
# 生成新的迁移文件
npm run migration:generate

# 运行所有待执行的迁移
npm run migration:run

# 回滚最后一个迁移
npm run migration:revert

# 运行种子数据
npm run seed
```

### 测试命令

```bash
# 运行所有测试
npm run test

# 运行测试并监听变化
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:cov

# 运行端到端测试
npm run test:e2e
```

### 构建命令

```bash
# 构建生产版本
npm run build

# 运行生产版本
npm run start:prod
```

### Docker命令

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart
```

## 项目结构说明

```
src/
├── common/          # 公共组件（装饰器、过滤器、拦截器）
├── config/          # 配置文件
├── database/        # 数据库配置、迁移、种子
├── modules/         # 功能模块
│   ├── auth/        # 认证模块
│   ├── users/       # 用户管理
│   ├── roles/       # 角色管理
│   ├── permissions/ # 权限管理
│   ├── health/      # 健康检查
│   ├── tasks/       # 定时任务
│   └── queue/       # 消息队列
├── app.module.ts    # 根模块
└── main.ts          # 应用入口
```

## 核心功能

### 1. 认证与授权
- JWT Token认证
- Refresh Token机制
- RBAC权限控制
- 路由守卫

### 2. 用户管理
- 用户CRUD操作
- 密码加密存储
- 用户状态管理

### 3. 角色与权限
- 角色管理
- 权限管理
- 角色权限关联

### 4. 缓存系统
- Redis缓存集成
- 缓存键管理
- 缓存过期策略

### 5. 消息队列
- 异步任务处理
- 邮件队列
- 通知队列
- 清理队列

### 6. 定时任务
- 每日清理任务
- 每小时统计任务
- 自定义Cron任务

### 7. 日志系统
- 结构化日志
- 日志轮转
- 多级别日志

### 8. 健康检查
- 数据库健康检查
- Redis健康检查
- 内存使用检查

### 9. API文档
- Swagger自动生成
- 交互式API测试
- 认证支持

### 10. 监控指标
- Prometheus指标
- 性能监控
- 健康状态

## 故障排查

### 问题1: 数据库连接失败

**错误信息**: `Access denied for user`

**解决方案**:
1. 检查MySQL容器是否运行：`docker-compose ps`
2. 检查 `.env` 文件中的数据库配置
3. 确认数据库已创建：`docker-compose exec mysql mysql -uroot -ppassword -e "SHOW DATABASES;"`

### 问题2: Redis连接失败

**错误信息**: `Connection refused`

**解决方案**:
1. 检查Redis容器是否运行：`docker-compose ps`
2. 检查Redis端口是否被占用：`netstat -ano | findstr :6379`
3. 重启Redis容器：`docker-compose restart redis`

### 问题3: 端口已被占用

**错误信息**: `EADDRINUSE: address already in use :::3000`

**解决方案**:
1. 修改 `.env` 文件中的PORT配置
2. 或者停止占用端口的进程：
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### 问题4: 迁移失败

**错误信息**: `QueryFailedError`

**解决方案**:
1. 删除数据库重新创建：
   ```bash
   docker-compose exec mysql mysql -uroot -ppassword -e "DROP DATABASE nestjs_microservice; CREATE DATABASE nestjs_microservice;"
   ```
2. 重新运行迁移：`npm run migration:run`

### 问题5: 测试失败

**错误信息**: `Test suite failed to run`

**解决方案**:
1. 确保所有依赖已安装：`npm install`
2. 清理缓存：`npm run test -- --clearCache`
3. 检查测试配置：`jest.config.js`

## 下一步

1. **阅读完整文档**: 查看 [README.md](./README.md) 了解更多详细信息
2. **查看项目结构**: 查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解架构设计
3. **自定义配置**: 根据需求修改 `.env` 文件
4. **开发新功能**: 参考现有模块开发新功能
5. **编写测试**: 为新功能编写单元测试和集成测试
6. **部署上线**: 使用Docker部署到生产环境

## 获取帮助

- 查看NestJS官方文档: https://docs.nestjs.com/
- 查看TypeORM文档: https://typeorm.io/
- 查看Redis文档: https://redis.io/docs/
- 提交问题: 在项目仓库提交Issue

## 许可证

MIT License
