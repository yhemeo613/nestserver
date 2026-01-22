import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator } from "@nestjs/terminus";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@ApiTags("健康检查")
@Controller("health")
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: "检查应用健康状态" })
    check() {
        return this.health.check([
            () => this.db.pingCheck("database"),
            () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
            () => this.memory.checkRSS("memory_rss", 150 * 1024 * 1024),
        ]);
    }

    @Get("cache")
    @ApiOperation({ summary: "检查缓存健康状态" })
    async checkCache() {
        try {
            const testKey = "health_check_test";
            await this.cacheManager.set(testKey, "ok", 5);
            const value = await this.cacheManager.get(testKey);
            await this.cacheManager.del(testKey);

            return {
                status: "ok",
                cache: value === "ok" ? "connected" : "disconnected",
            };
        } catch (error) {
            return {
                status: "error",
                cache: "disconnected",
                error: error.message,
            };
        }
    }
}
