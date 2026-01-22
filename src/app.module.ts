import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bull";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-ioredis";
import { WinstonModule } from "nest-winston";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { RolesModule } from "./modules/roles/roles.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";
import { HealthModule } from "./modules/health/health.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { QueueModule } from "./modules/queue/queue.module";
import { loggerConfig } from "./config/logger.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "mysql",
                host: configService.get("DB_HOST"),
                port: configService.get("DB_PORT"),
                username: configService.get("DB_USERNAME"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_DATABASE"),
                autoLoadEntities: true,
                synchronize: configService.get("DB_SYNCHRONIZE"),
                logging: configService.get("DB_LOGGING"),
                timezone: "+08:00",
                charset: "utf8mb4",
                extra: {
                    connectionLimit: 10,
                },
            }),
            inject: [ConfigService],
        }),

        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get("REDIS_HOST"),
                port: configService.get("REDIS_PORT"),
                password: configService.get("REDIS_PASSWORD") || undefined,
                db: configService.get("REDIS_DB"),
                ttl: 60,
            }),
            inject: [ConfigService],
        }),

        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.get("THROTTLE_TTL") || 60,
                    limit: configService.get("THROTTLE_LIMIT") || 100,
                },
            ],
            inject: [ConfigService],
        }),

        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.get("REDIS_QUEUE_HOST"),
                    port: configService.get("REDIS_QUEUE_PORT"),
                    password: configService.get("REDIS_QUEUE_PASSWORD") || undefined,
                    db: configService.get("REDIS_QUEUE_DB"),
                },
            }),
            inject: [ConfigService],
        }),

        WinstonModule.forRoot(loggerConfig),

        ScheduleModule.forRoot(),

        PrometheusModule.register({
            path: "/metrics",
            defaultMetrics: {
                enabled: true,
            },
        }),

        AuthModule,
        UsersModule,
        RolesModule,
        PermissionsModule,
        HealthModule,
        TasksModule,
        QueueModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
