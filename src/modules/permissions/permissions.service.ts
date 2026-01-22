import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Permission } from "./entities/permission.entity";
import { CreatePermissionDto, UpdatePermissionDto } from "./dto/permission.dto";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class PermissionsService {
    private readonly logger = new Logger(PermissionsService.name);

    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        const existingPermission = await this.permissionRepository.findOne({
            where: { name: createPermissionDto.name },
        });

        if (existingPermission) {
            throw new ConflictException("权限名称已存在");
        }

        const permission = this.permissionRepository.create(createPermissionDto);
        const savedPermission = await this.permissionRepository.save(permission);
        this.logger.log(`权限已创建: ${savedPermission.id}`);
        return savedPermission;
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        const cacheKey = `permissions:page:${page}:limit:${limit}:search:${search || "none"}`;

        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        const queryBuilder = this.permissionRepository
            .createQueryBuilder("permission")
            .skip(skip)
            .take(limit)
            .orderBy("permission.createdAt", "DESC");

        if (search) {
            queryBuilder.where(
                "permission.name LIKE :search OR permission.resource LIKE :search OR permission.description LIKE :search",
                { search: `%${search}%` },
            );
        }

        const [permissions, total] = await queryBuilder.getManyAndCount();

        const result = {
            data: permissions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };

        await this.cacheManager.set(cacheKey, result, 60);
        return result;
    }

    async findOne(id: string): Promise<Permission> {
        const cacheKey = `permission:${id}`;
        const cached = await this.cacheManager.get<Permission>(cacheKey);

        if (cached) {
            return cached;
        }

        const permission = await this.permissionRepository.findOne({
            where: { id },
            relations: ["roles"],
        });

        if (!permission) {
            throw new NotFoundException(`ID为 ${id} 的权限未找到`);
        }

        await this.cacheManager.set(cacheKey, permission, 300);
        return permission;
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        const permission = await this.findOne(id);
        Object.assign(permission, updatePermissionDto);
        const updatedPermission = await this.permissionRepository.save(permission);

        await this.cacheManager.del(`permission:${id}`);
        this.logger.log(`权限已更新: ${id}`);
        return updatedPermission;
    }

    async remove(id: string): Promise<void> {
        const permission = await this.findOne(id);
        await this.permissionRepository.remove(permission);
        await this.cacheManager.del(`permission:${id}`);
        this.logger.log(`权限已删除: ${id}`);
    }
}
