# NestJS Microservice Architecture

A high-performance, scalable NestJS microservice architecture with MySQL database and Redis cache system.

## Features

### Core Architecture
- **Modular Design**: Separation of core modules, business modules, and common modules
- **TypeScript**: Full TypeScript support with strict type checking
- **Dependency Injection**: Leverages NestJS DI system
- **AOP (Aspect-Oriented Programming)**: Interceptors, guards, and filters

### Database Layer
- **TypeORM**: Advanced ORM with MySQL support
- **Migrations**: Database version control and migration scripts
- **Seed Data**: Database seeding functionality
- **Transaction Management**: Database transaction support
- **Query Optimization**: Optimized queries with caching

### Caching System
- **Redis Integration**: High-performance caching layer
- **Cache Strategies**: Configurable TTL and cache policies
- **Cache Key Management**: Structured cache key organization
- **Cache Penetration Protection**: Protection against cache penetration
- **Data Consistency**: Cache-DB consistency mechanisms

### Third-Party Integrations

#### Authentication & Authorization
- **Passport.js**: JWT-based authentication
- **RBAC**: Role-Based Access Control system
- **Refresh Tokens**: Secure token refresh mechanism

#### API Documentation
- **Swagger/OpenAPI**: Auto-generated API documentation
- **Interactive UI**: Test API endpoints directly

#### Logging
- **Winston**: Structured logging system
- **Log Rotation**: Daily log rotation with retention
- **Multiple Transports**: Console and file logging

#### Configuration
- **ConfigModule**: Environment variable management
- **Type-safe Configuration**: Typed configuration access

#### Validation
- **class-validator**: Request parameter validation
- **class-transformer**: Data transformation

#### Task Scheduling
- **node-schedule**: Cron-based task scheduling
- **Scheduled Jobs**: Daily, hourly, and custom schedules

#### Rate Limiting
- **@nestjs/throttler**: API rate limiting
- **Configurable Limits**: Customizable rate limits

#### Message Queue
- **Bull**: Redis-based job queue
- **Async Task Processing**: Background job processing
- **Job Retries**: Automatic retry mechanism

### Architecture Enhancements
- **RBAC System**: Role and permission management
- **Distributed Lock**: Redis-based distributed locking
- **Health Checks**: Application health monitoring
- **Metrics**: Prometheus metrics integration

### Development Tools
- **Hot Reload**: Development server with hot reload
- **Unit Testing**: Jest-based unit testing
- **Integration Testing**: End-to-end testing
- **Linting**: ESLint with Prettier

### Deployment
- **Docker**: Containerized deployment
- **Docker Compose**: Multi-container orchestration
- **Health Endpoints**: Health check APIs

## Project Structure

```
nestjs-microservice-architecture/
├── src/
│   ├── common/                 # Common utilities and decorators
│   │   ├── decorators/         # Custom decorators
│   │   ├── dto/               # Shared DTOs
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Request/response interceptors
│   │   └── services/          # Common services (Redis lock, etc.)
│   ├── config/                # Configuration files
│   │   └── logger.config.ts   # Winston logger configuration
│   ├── database/              # Database configurations
│   │   ├── data-source.ts     # TypeORM data source
│   │   ├── migrations/        # Database migrations
│   │   └── seeds/             # Database seeds
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── roles/             # Role management
│   │   ├── permissions/       # Permission management
│   │   ├── health/            # Health checks
│   │   ├── tasks/             # Scheduled tasks
│   │   └── queue/             # Message queue
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # Root controller
│   ├── app.service.ts         # Root service
│   └── main.ts                # Application entry point
├── test/                      # Test files
├── logs/                      # Application logs
├── .env                       # Environment variables
├── .env.example               # Environment template
├── docker-compose.yml         # Docker compose configuration
├── Dockerfile                 # Docker image configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── nest-cli.json              # NestJS CLI configuration
└── jest.config.js             # Jest test configuration
```

## Installation

### Prerequisites
- Node.js >= 20.x
- MySQL >= 8.0
- Redis >= 7.0
- Docker (optional)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd nestjs-microservice-architecture
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MySQL and Redis (using Docker):
```bash
docker-compose up -d mysql redis
```

5. Run database migrations:
```bash
npm run migration:run
```

6. Start the application:
```bash
npm run start:dev
```

## Usage

### API Documentation
Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api/v1/docs
```

### Health Check
Check application health:
```bash
curl http://localhost:3000/api/v1/health
```

### Authentication

#### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Access Protected Routes
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <your-access-token>"
```

## Available Scripts

- `npm run build` - Build the application
- `npm run format` - Format code with Prettier
- `npm run start` - Start the application in production mode
- `npm run start:dev` - Start the application in development mode with hot reload
- `npm run start:debug` - Start the application in debug mode
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration
- `npm run seed` - Run database seeds

## Database Migrations

### Create a Migration
```bash
npm run typeorm -- migration:create -n MigrationName
```

### Generate Migration from Entity Changes
```bash
npm run migration:generate
```

### Run Migrations
```bash
npm run migration:run
```

### Revert Migration
```bash
npm run migration:revert
```

## Docker Deployment

### Build and Start All Services
```bash
docker-compose up -d
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f app
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Application environment | development |
| PORT | Server port | 3000 |
| API_PREFIX | API route prefix | api/v1 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_USERNAME | Database username | root |
| DB_PASSWORD | Database password | password |
| DB_DATABASE | Database name | nestjs_microservice |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | JWT expiration time | 1d |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiration | 7d |
| THROTTLE_TTL | Rate limit TTL (seconds) | 60 |
| THROTTLE_LIMIT | Rate limit count | 100 |

## Architecture Highlights

### Modular Design
The application follows a modular architecture where each feature is encapsulated in its own module. This promotes:
- Separation of concerns
- Reusability
- Maintainability
- Scalability

### RBAC System
Role-Based Access Control provides:
- User management
- Role assignment
- Permission management
- Fine-grained access control

### Caching Strategy
Multi-layer caching with:
- Redis as the cache store
- Configurable TTL
- Cache invalidation on updates
- Cache penetration protection

### Message Queue
Asynchronous task processing with:
- Multiple queue types (email, notification, cleanup)
- Job retries with exponential backoff
- Job monitoring and statistics
- Dead letter queue support

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Monitoring

### Health Endpoints
- `/api/v1/health` - Overall health check
- `/api/v1/health/cache` - Cache health check

### Metrics
Prometheus metrics are available at:
```
http://localhost:3000/metrics
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation with class-validator
- SQL injection prevention (TypeORM)
- XSS protection

## Performance Optimization

- Database query optimization
- Redis caching layer
- Connection pooling
- Lazy loading
- Response compression
- Static asset serving

## Best Practices

This project follows NestJS best practices:
- Dependency injection
- Modular architecture
- Separation of concerns
- SOLID principles
- Clean code
- Comprehensive testing
- Documentation

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
