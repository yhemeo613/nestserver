import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}

    getInfo() {
        return {
            name: "NestJS 微服务架构",
            version: "1.0.0",
            environment: this.configService.get("NODE_ENV"),
            timestamp: new Date().toISOString(),
        };
    }
}
