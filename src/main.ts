/*
 * @Author: dzy dzyperson@163.com
 * @Date: 2026-01-22 10:45:42
 * @LastEditors: dzy dzyperson@163.com
 * @LastEditTime: 2026-01-22 12:02:11
 * @FilePath: \nestjs服务架构\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import compression from "compression";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ["error", "warn", "log", "debug", "verbose"],
    });

    const configService = app.get(ConfigService);
    const logger = new Logger("Bootstrap");

    const port = configService.get<number>("PORT") || 3000;
    const apiPrefix = configService.get<string>("API_PREFIX") || "api/v1";

    app.setGlobalPrefix(apiPrefix);

    app.use(helmet());
    app.use(compression());

    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalInterceptors(new LoggingInterceptor());

    const swaggerConfig = new DocumentBuilder()
        .setTitle("NestJS 后台服务 API")
        .setDescription("高性能 NestJS 后台服务架构 API 文档")
        .setVersion("1.0")
        .addBearerAuth()
        .addTag("认证管理", "用户注册、登录与令牌管理")
        .addTag("用户管理", "系统用户的增删改查操作")
        .addTag("角色管理", "系统角色的配置与权限分配")
        .addTag("权限管理", "系统权限资源的定义与管理")
        .addTag("健康检查", "应用运行状态与依赖服务检查")
        .addTag("队列管理", "后台任务队列的监控与管理")
        .addTag("应用", "应用基础信息查询")
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: "alpha",
            operationsSorter: "alpha",
        },
    });

    await app.listen(port);

    logger.log(`🚀 应用运行在: http://localhost:${port}`);
    logger.log(`📚 API 文档: http://localhost:${port}/${apiPrefix}/docs`);
    logger.log(`🎯 环境: ${configService.get("NODE_ENV")}`);
}

bootstrap();
