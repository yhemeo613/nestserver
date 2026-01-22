# 项目结构概览

## 目录结构

```
nestjs-microservice-architecture/
│
├── src/                                    # 源代码目录
│   ├── common/                             # 公共模块
│   │   ├── decorators/                     # 自定义装饰器
│   │   │   └── auth.decorator.ts          # 认证相关装饰器 (@Roles, @Permissions, @Public)
│   │   ├── dto/                            # 公共数据传输对象
│   │   │   └── response.dto.ts            # 统一响应格式
│   │   ├── filters/                        # 异常过滤器
│   │   │   └── http-exception.filter.ts   # 全局HTTP异常过滤器
│   │   ├── interceptors/                   # 拦截器
│   │   │   ├── transform.interceptor.ts   # 响应转换拦截器
│   │   │   └── logging.interceptor.ts     # 日志记录拦截器
│   │   └── services/                       # 公共服务
│   │       └── redis-lock.service.ts       # Redis分布式锁服务
│   │
│   ├── config/                             # 配置文件
│   │   └── logger.config.ts               # Winston日志配置
│   │
│   ├── database/                           # 数据库相关
│   │   ├── data-source.ts                 # TypeORM数据源配置
│   │   ├── migrations/                     # 数据库迁移文件
│   │   │   └── 1700000000000-InitialSchema.ts
│   │   └── seeds/                         # 数据库种子数据
│   │       ├── seed.ts                    # 种子数据定义
│   │       └── run-seed.ts                # 种子数据运行脚本
│   │
│   ├── modules/                            # 功能模块
│   │   ├── auth/                          # 认证模块
│   │   │   ├── dto/
│   │   │   │   └── auth.dto.ts           # 认证相关DTO
│   │   │   ├── entities/
│   │   │   │   └── refresh-token.entity.ts # 刷新令牌实体
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts     # JWT认证守卫
│   │   │   │   └── roles.guard.ts        # 角色权限守卫
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts       # JWT策略
│   │   │   │   └── local.strategy.ts     # 本地认证策略
│   │   │   ├── auth.controller.ts         # 认证控制器
│   │   │   ├── auth.service.ts            # 认证服务
│   │   │   ├── auth.module.ts             # 认证模块
│   │   │   └── auth.service.spec.ts      # 认证服务测试
│   │   │
│   │   ├── users/                         # 用户管理模块
│   │   │   ├── dto/
│   │   │   │   └── user.dto.ts           # 用户相关DTO
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts        # 用户实体
│   │   │   ├── users.controller.ts        # 用户控制器
│   │   │   ├── users.service.ts          # 用户服务
│   │   │   └── users.module.ts           # 用户模块
│   │   │
│   │   ├── roles/                         # 角色管理模块
│   │   │   ├── dto/
│   │   │   │   └── role.dto.ts           # 角色相关DTO
│   │   │   ├── entities/
│   │   │   │   └── role.entity.ts        # 角色实体
│   │   │   ├── roles.controller.ts        # 角色控制器
│   │   │   ├── roles.service.ts          # 角色服务
│   │   │   └── roles.module.ts           # 角色模块
│   │   │
│   │   ├── permissions/                   # 权限管理模块
│   │   │   ├── dto/
│   │   │   │   └── permission.dto.ts     # 权限相关DTO
│   │   │   ├── entities/
│   │   │   │   └── permission.entity.ts  # 权限实体
│   │   │   ├── permissions.controller.ts  # 权限控制器
│   │   │   ├── permissions.service.ts    # 权限服务
│   │   │   └── permissions.module.ts     # 权限模块
│   │   │
│   │   ├── health/                        # 健康检查模块
│   │   │   ├── health.controller.ts      # 健康检查控制器
│   │   │   └── health.module.ts          # 健康检查模块
│   │   │
│   │   ├── tasks/                         # 定时任务模块
│   │   │   ├── tasks.service.ts          # 定时任务服务
│   │   │   └── tasks.module.ts           # 定时任务模块
│   │   │
│   │   └── queue/                         # 消息队列模块
│   │       ├── queue.service.ts           # 队列服务
│   │       ├── queue.processor.ts         # 队列处理器
│   │       ├── queue.controller.ts        # 队列控制器
│   │       └── queue.module.ts            # 队列模块
│   │
│   ├── app.module.ts                       # 根模块
│   ├── app.controller.ts                   # 根控制器
│   ├── app.service.ts                      # 根服务
│   └── main.ts                             # 应用入口
│
├── test/                                   # 测试文件
│   └── setup.ts                           # 测试配置
│
├── logs/                                   # 日志目录（运行时生成）
│
├── .env                                    # 环境变量
├── .env.example                            # 环境变量示例
├── .gitignore                              # Git忽略文件
├── Dockerfile                              # Docker镜像配置
├── docker-compose.yml                      # Docker Compose配置
├── jest.config.js                          # Jest测试配置
├── nest-cli.json                           # NestJS CLI配置
├── package.json                            # 项目依赖和脚本
├── tsconfig.json                           # TypeScript配置
└── README.md                               # 项目说明文档
```

## 核心架构说明

### 1. 模块化架构
项目采用模块化设计，每个功能模块独立封装：
- **AuthModule**: 认证和授权
- **UsersModule**: 用户管理
- **RolesModule**: 角色管理
- **PermissionsModule**: 权限管理
- **HealthModule**: 健康检查
- **TasksModule**: 定时任务
- **QueueModule**: 消息队列

### 2. 分层架构
每个模块遵循标准的分层架构：
- **Controller**: 处理HTTP请求和响应
- **Service**: 业务逻辑处理
- **Entity**: 数据模型定义
- **DTO**: 数据传输对象
- **Guard**: 路由守卫
- **Strategy**: 认证策略

### 3. 公共组件
- **Decorators**: 自定义装饰器（@Roles, @Permissions, @Public）
- **Filters**: 全局异常过滤器
- **Interceptors**: 请求/响应拦截器
- **Services**: 公共服务（Redis锁等）

### 4. 数据库层
- **TypeORM**: ORM框架
- **Migrations**: 数据库版本控制
- **Seeds**: 种子数据
- **Entities**: 实体定义

### 5. 缓存层
- **Redis**: 缓存存储
- **Cache Manager**: 缓存管理
- **分布式锁**: Redis锁服务

### 6. 安全层
- **JWT**: JSON Web Token认证
- **Passport**: 认证中间件
- **RBAC**: 基于角色的访问控制
- **Rate Limiting**: API限流

### 7. 日志层
- **Winston**: 结构化日志
- **日志轮转**: 按天轮转
- **多级别**: debug, info, warn, error

### 8. 任务层
- **node-schedule**: 定时任务
- **Bull**: 消息队列
- **异步处理**: 后台任务处理

### 9. 监控层
- **Health Checks**: 健康检查
- **Prometheus**: 指标监控
- **Metrics**: 性能指标

## 技术栈

### 后端框架
- **NestJS**: Node.js企业级框架
- **TypeScript**: 类型安全的JavaScript超集

### 数据库
- **MySQL**: 关系型数据库
- **TypeORM**: ORM框架
- **Redis**: 缓存和消息队列

### 认证授权
- **Passport.js**: 认证中间件
- **JWT**: JSON Web Token
- **bcrypt**: 密码加密

### 文档
- **Swagger/OpenAPI**: API文档自动生成

### 日志
- **Winston**: 日志库
- **winston-daily-rotate-file**: 日志轮转

### 任务调度
- **node-schedule**: 定时任务
- **Bull**: 消息队列

### 验证
- **class-validator**: 数据验证
- **class-transformer**: 数据转换

### 监控
- **Prometheus**: 指标监控
- **@nestjs/terminus**: 健康检查

### 开发工具
- **Jest**: 单元测试框架
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Docker**: 容器化部署

## 关键特性

### 1. 高性能
- Redis缓存层
- 数据库连接池
- 查询优化
- 响应压缩

### 2. 可扩展
- 模块化设计
- 微服务架构
- 消息队列
- 分布式锁

### 3. 安全性
- JWT认证
- RBAC权限控制
- 密码加密
- API限流
- CORS配置
- Helmet安全头

### 4. 可维护性
- 清晰的代码结构
- 完善的注释
- 统一的错误处理
- 结构化日志
- 全面的测试

### 5. 可观测性
- 健康检查
- 指标监控
- 结构化日志
- API文档

## 部署架构

```
┌─────────────────────────────────────────────────┐
│                   客户端                        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              Nginx (反向代理)                    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│          NestJS 应用 (Docker容器)               │
│  ┌──────────────────────────────────────────┐  │
│  │  - 认证模块                              │  │
│  │  - 用户管理                              │  │
│  │  - 角色权限                              │  │
│  │  - 业务逻辑                              │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│   MySQL       │   │    Redis      │
│  (Docker)     │   │   (Docker)    │
└───────────────┘   └───────────────┘
```

## 开发流程

### 1. 本地开发
```bash
# 安装依赖
npm install

# 启动MySQL和Redis
docker-compose up -d mysql redis

# 运行迁移
npm run migration:run

# 运行种子数据
npm run seed

# 启动开发服务器
npm run start:dev
```

### 2. 测试
```bash
# 运行单元测试
npm run test

# 运行测试并生成覆盖率
npm run test:cov

# 运行端到端测试
npm run test:e2e
```

### 3. 构建
```bash
# 构建生产版本
npm run build

# 运行生产版本
npm run start:prod
```

### 4. Docker部署
```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止所有服务
docker-compose down
```

## 最佳实践

1. **代码组织**: 遵循模块化和分层架构
2. **错误处理**: 使用统一的异常过滤器
3. **日志记录**: 使用结构化日志
4. **缓存策略**: 合理使用Redis缓存
5. **安全**: 始终验证和清理用户输入
6. **测试**: 编写全面的单元测试和集成测试
7. **文档**: 保持API文档更新
8. **性能**: 优化数据库查询和缓存策略
9. **监控**: 使用健康检查和指标监控
10. **部署**: 使用Docker进行容器化部署
