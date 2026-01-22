/*
 * @Author: dzy dzyperson@163.com
 * @Date: 2026-01-22 10:48:59
 * @LastEditors: dzy dzyperson@163.com
 * @LastEditTime: 2026-01-22 12:22:39
 * @FilePath: \训练\nest-server\src\common\services\redis-lock.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, Logger } from "@nestjs/common";
import { Inject, Injectable as NestInjectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class RedisLockService {
    private readonly logger = new Logger(RedisLockService.name);
    private readonly lockPrefix = "lock:";
    private readonly defaultTTL = 30;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async acquireLock(key: string, ttl: number = this.defaultTTL): Promise<boolean> {
        const lockKey = this.lockPrefix + key;
        const lockValue = Date.now().toString();

        try {
            const existing = await this.cacheManager.get(lockKey);
            if (existing) {
                return false;
            }

            await this.cacheManager.set(lockKey, lockValue, ttl);
            this.logger.debug(`已获取锁: ${lockKey}`);
            return true;
        } catch (error) {
            this.logger.error(`获取锁失败: ${lockKey}`, error);
            return false;
        }
    }

    async releaseLock(key: string): Promise<boolean> {
        const lockKey = this.lockPrefix + key;

        try {
            await this.cacheManager.del(lockKey);
            this.logger.debug(`已释放锁: ${lockKey}`);
            return true;
        } catch (error) {
            this.logger.error(`释放锁失败: ${lockKey}`, error);
            return false;
        }
    }

    async executeWithLock<T>(key: string, fn: () => Promise<T>, ttl: number = this.defaultTTL): Promise<T | null> {
        const acquired = await this.acquireLock(key, ttl);

        if (!acquired) {
            this.logger.warn(`获取锁失败（用于执行）: ${key}`);
            return null;
        }

        try {
            return await fn();
        } finally {
            await this.releaseLock(key);
        }
    }
}
