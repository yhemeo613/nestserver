import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Role } from "./entities/role.entity";
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from "./dto/role.dto";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name);

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({
            where: { name: createRoleDto.name },
        });

        if (existingRole) {
            throw new ConflictException("角色名称已存在");
        }

        const role = this.roleRepository.create(createRoleDto);
        const savedRole = await this.roleRepository.save(role);
        this.logger.log(`角色已创建: ${savedRole.id}`);
        return savedRole;
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        const cacheKey = `roles:page:${page}:limit:${limit}:search:${search || "none"}`;

        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        const queryBuilder = this.roleRepository
            .createQueryBuilder("role")
            .leftJoinAndSelect("role.permissions", "permissions")
            .skip(skip)
            .take(limit)
            .orderBy("role.createdAt", "DESC");

        if (search) {
            queryBuilder.where("role.name LIKE :search OR role.description LIKE :search", {
                search: `%${search}%`,
            });
        }

        const [roles, total] = await queryBuilder.getManyAndCount();

        const result = {
            data: roles,
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

    async findOne(id: string): Promise<Role> {
        const cacheKey = `role:${id}`;
        const cached = await this.cacheManager.get<Role>(cacheKey);

        if (cached) {
            return cached;
        }

        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ["permissions", "users"],
        });

        if (!role) {
            throw new NotFoundException(`ID为 ${id} 的角色未找到`);
        }

        await this.cacheManager.set(cacheKey, role, 300);
        return role;
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const role = await this.findOne(id);
        Object.assign(role, updateRoleDto);
        const updatedRole = await this.roleRepository.save(role);

        await this.cacheManager.del(`role:${id}`);
        this.logger.log(`角色已更新: ${id}`);
        return updatedRole;
    }

    async remove(id: string): Promise<void> {
        const role = await this.findOne(id);
        await this.roleRepository.remove(role);
        await this.cacheManager.del(`role:${id}`);
        this.logger.log(`角色已删除: ${id}`);
    }

    async assignPermissions(id: string, assignPermissionsDto: AssignPermissionsDto): Promise<Role> {
        const role = await this.findOne(id);
        const { permissionIds } = assignPermissionsDto;

        const permissions = permissionIds.map((id) => ({ id }) as any);
        role.permissions = permissions;

        const updatedRole = await this.roleRepository.save(role);
        await this.cacheManager.del(`role:${id}`);
        this.logger.log(`已为角色分配权限: ${id}`);
        return updatedRole;
    }
}
