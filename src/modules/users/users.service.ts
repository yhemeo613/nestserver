import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import * as bcrypt from "bcryptjs";
import { Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: [{ username: createUserDto.username }, { email: createUserDto.email }],
        });

        if (existingUser) {
            throw new ConflictException("用户名或邮箱已存在");
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);
        this.logger.log(`用户已创建: ${savedUser.id}`);
        return savedUser;
    }

    async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        const cacheKey = `users:page:${page}:limit:${limit}:search:${search || "none"}`;

        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        const queryBuilder = this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.roles", "roles")
            .skip(skip)
            .take(limit)
            .orderBy("user.createdAt", "DESC");

        if (search) {
            queryBuilder.where(
                "user.username LIKE :search OR user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search",
                { search: `%${search}%` },
            );
        }

        const [users, total] = await queryBuilder.getManyAndCount();

        const result = {
            data: users,
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

    async findOne(id: string): Promise<User> {
        const cacheKey = `user:${id}`;
        const cached = await this.cacheManager.get<User>(cacheKey);

        if (cached) {
            return cached;
        }

        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["roles", "roles.permissions"],
        });

        if (!user) {
            throw new NotFoundException(`ID为 "${id}" 的用户未找到`);
        }

        await this.cacheManager.set(cacheKey, user, 300);
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ["roles", "roles.permissions"],
        });

        return user;
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { username },
            relations: ["roles", "roles.permissions"],
        });

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        const updatedUser = await this.userRepository.save(user);

        await this.cacheManager.del(`user:${id}`);
        this.logger.log(`用户已更新: ${id}`);
        return updatedUser;
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
        await this.cacheManager.del(`user:${id}`);
        this.logger.log(`用户已删除: ${id}`);
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }

    async updateLastLogin(id: string): Promise<void> {
        await this.userRepository.update(id, { lastLoginAt: new Date() });
    }
}
