# API 使用示例

本文档提供了NestJS微服务架构中各个API端点的详细使用示例。

## 基础信息

- **Base URL**: `http://localhost:3000/api/v1`
- **认证方式**: Bearer Token (JWT)
- **内容类型**: `application/json`

## 认证相关API

### 1. 用户注册

**端点**: `POST /auth/register`

**描述**: 注册新用户

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 2. 用户登录

**端点**: `POST /auth/login`

**描述**: 用户登录获取访问令牌

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 3. 刷新令牌

**端点**: `POST /auth/refresh`

**描述**: 使用刷新令牌获取新的访问令牌

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 4. 用户登出

**端点**: `POST /auth/logout`

**描述**: 用户登出，使刷新令牌失效

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应示例**: `204 No Content`

### 5. 获取当前用户信息

**端点**: `GET /auth/profile`

**描述**: 获取当前登录用户的信息

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "username": "admin",
    "roles": ["admin"]
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

## 用户管理API

### 1. 获取用户列表

**端点**: `GET /users`

**描述**: 获取用户列表，支持分页和搜索

**请求示例**:
```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "isActive": true,
        "lastLoginAt": "2024-01-22T10:00:00.000Z",
        "createdAt": "2024-01-22T09:00:00.000Z",
        "updatedAt": "2024-01-22T10:00:00.000Z",
        "roles": [
          {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "name": "user",
            "description": "Standard user role"
          }
        ]
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 2. 获取单个用户

**端点**: `GET /users/:id`

**描述**: 根据ID获取用户详情

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "lastLoginAt": "2024-01-22T10:00:00.000Z",
    "createdAt": "2024-01-22T09:00:00.000Z",
    "updatedAt": "2024-01-22T10:00:00.000Z",
    "roles": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "user",
        "description": "Standard user role",
        "permissions": [
          {
            "id": "770e8400-e29b-41d4-a716-446655440002",
            "name": "user:read",
            "resource": "user",
            "action": "read"
          }
        ]
      }
    ]
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 3. 创建用户

**端点**: `POST /users`

**描述**: 创建新用户（需要管理员权限）

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_doe",
    "email": "jane@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Doe"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "username": "jane_doe",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-22T10:00:00.000Z",
    "updatedAt": "2024-01-22T10:00:00.000Z"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 4. 更新用户

**端点**: `PATCH /users/:id`

**描述**: 更新用户信息（需要管理员权限）

**请求示例**:
```bash
curl -X PATCH http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "isActive": false
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "username": "jane_doe",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "isActive": false,
    "createdAt": "2024-01-22T10:00:00.000Z",
    "updatedAt": "2024-01-22T10:05:00.000Z"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:05:00.000Z"
}
```

### 5. 删除用户

**端点**: `DELETE /users/:id`

**描述**: 删除用户（需要管理员权限）

**请求示例**:
```bash
curl -X DELETE http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**响应示例**: `204 No Content`

## 角色管理API

### 1. 获取角色列表

**端点**: `GET /roles`

**描述**: 获取角色列表，支持分页和搜索

**请求示例**:
```bash
curl -X GET "http://localhost:3000/api/v1/roles?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "admin",
        "description": "Administrator role with full access",
        "isActive": true,
        "createdAt": "2024-01-22T09:00:00.000Z",
        "updatedAt": "2024-01-22T09:00:00.000Z",
        "permissions": [
          {
            "id": "770e8400-e29b-41d4-a716-446655440000",
            "name": "user:read",
            "resource": "user",
            "action": "read"
          }
        ]
      }
    ],
    "meta": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 2. 获取单个角色

**端点**: `GET /roles/:id`

**描述**: 根据ID获取角色详情

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/v1/roles/660e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "admin",
    "description": "Administrator role with full access",
    "isActive": true,
    "createdAt": "2024-01-22T09:00:00.000Z",
    "updatedAt": "2024-01-22T09:00:00.000Z",
    "permissions": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "user:read",
        "resource": "user",
        "action": "read",
        "description": "Read user information"
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "name": "user:write",
        "resource": "user",
        "action": "write",
        "description": "Write user information"
      }
    ],
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "admin",
        "email": "admin@example.com"
      }
    ]
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 3. 创建角色

**端点**: `POST /roles`

**描述**: 创建新角色（需要管理员权限）

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/roles \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "moderator",
    "description": "Moderator role with limited access",
    "isActive": true
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "moderator",
    "description": "Moderator role with limited access",
    "isActive": true,
    "createdAt": "2024-01-22T10:00:00.000Z",
    "updatedAt": "2024-01-22T10:00:00.000Z"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 4. 为角色分配权限

**端点**: `POST /roles/:id/permissions`

**描述**: 为角色分配权限（需要管理员权限）

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/roles/660e8400-e29b-41d4-a716-446655440001/permissions \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionIds": [
      "770e8400-e29b-41d4-a716-446655440000",
      "770e8400-e29b-41d4-a716-446655440001"
    ]
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "moderator",
    "description": "Moderator role with limited access",
    "isActive": true,
    "createdAt": "2024-01-22T10:00:00.000Z",
    "updatedAt": "2024-01-22T10:05:00.000Z",
    "permissions": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "user:read",
        "resource": "user",
        "action": "read"
      }
    ]
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:05:00.000Z"
}
```

## 权限管理API

### 1. 获取权限列表

**端点**: `GET /permissions`

**描述**: 获取权限列表，支持分页和搜索

**请求示例**:
```bash
curl -X GET "http://localhost:3000/api/v1/permissions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "user:read",
        "resource": "user",
        "action": "read",
        "description": "Read user information",
        "isActive": true,
        "createdAt": "2024-01-22T09:00:00.000Z",
        "updatedAt": "2024-01-22T09:00:00.000Z"
      }
    ],
    "meta": {
      "total": 6,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 2. 创建权限

**端点**: `POST /permissions`

**描述**: 创建新权限（需要管理员权限）

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/permissions \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "post:write",
    "resource": "post",
    "action": "write",
    "description": "Write post information",
    "isActive": true
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440006",
    "name": "post:write",
    "resource": "post",
    "action": "write",
    "description": "Write post information",
    "isActive": true,
    "createdAt": "2024-01-22T10:00:00.000Z",
    "updatedAt": "2024-01-22T10:00:00.000Z"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

## 健康检查API

### 1. 应用健康检查

**端点**: `GET /health`

**描述**: 检查应用整体健康状态

**请求示例**:
```bash
curl http://localhost:3000/api/v1/health
```

**响应示例**:
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  }
}
```

### 2. 缓存健康检查

**端点**: `GET /health/cache`

**描述**: 检查Redis缓存健康状态

**请求示例**:
```bash
curl http://localhost:3000/api/v1/health/cache
```

**响应示例**:
```json
{
  "status": "ok",
  "cache": "connected"
}
```

## 消息队列API

### 1. 获取队列统计

**端点**: `GET /queue/stats/:queueName`

**描述**: 获取指定队列的统计信息（需要管理员权限）

**请求示例**:
```bash
curl -X GET http://localhost:3000/api/v1/queue/stats/email \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "queue": "email",
    "waiting": 0,
    "active": 0,
    "completed": 10,
    "failed": 0
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 2. 添加邮件任务

**端点**: `POST /queue/email`

**描述**: 添加邮件发送任务到队列（需要管理员权限）

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/v1/queue/email \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Welcome",
    "template": "welcome",
    "data": {
      "name": "John Doe"
    }
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "success": true,
    "jobId": "1"
  },
  "message": "Success",
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

## 错误响应格式

所有API错误响应遵循统一格式：

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Validation failed",
    "error": "Bad Request",
    "path": "/api/v1/users",
    "timestamp": "2024-01-22T10:00:00.000Z"
  },
  "timestamp": "2024-01-22T10:00:00.000Z"
}
```

### 常见HTTP状态码

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `204 No Content`: 请求成功，无返回内容
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权
- `403 Forbidden`: 无权限访问
- `404 Not Found`: 资源不存在
- `409 Conflict`: 资源冲突
- `422 Unprocessable Entity`: 验证失败
- `429 Too Many Requests`: 请求过于频繁
- `500 Internal Server Error`: 服务器内部错误

## 使用Postman测试

1. 导入API集合（如果提供）
2. 设置环境变量：
   - `base_url`: `http://localhost:3000/api/v1`
   - `access_token`: 从登录响应中获取
3. 在请求头中添加：
   - `Authorization`: `Bearer {{access_token}}`
   - `Content-Type`: `application/json`

## 使用Swagger UI

访问 `http://localhost:3000/api/v1/docs` 可以直接在浏览器中测试所有API。

1. 点击右上角 "Authorize" 按钮
2. 输入Bearer Token（格式：`your-access-token`）
3. 点击 "Authorize" 确认
4. 选择要测试的API端点
5. 点击 "Try it out"
6. 填写请求参数
7. 点击 "Execute" 执行请求

## 注意事项

1. **Token过期**: Access Token默认有效期为1小时，Refresh Token为7天
2. **权限要求**: 部分API需要特定角色权限（如admin）
3. **请求限流**: 默认每分钟最多100个请求
4. **数据验证**: 所有请求参数都会经过验证
5. **错误处理**: 统一的错误响应格式便于调试

## 更多信息

- 查看完整文档: [README.md](./README.md)
- 快速开始: [QUICKSTART.md](./QUICKSTART.md)
- 项目结构: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
