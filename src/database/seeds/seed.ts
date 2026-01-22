import { DataSource } from "typeorm";
import * as bcrypt from "bcryptjs";

export async function runSeed(dataSource: DataSource) {
    console.log("开始数据库播种...");

    const userRepository = dataSource.getRepository("User");
    const roleRepository = dataSource.getRepository("Role");
    const permissionRepository = dataSource.getRepository("Permission");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminRole = roleRepository.create({
        name: "admin",
        description: "拥有完全访问权限的管理员角色",
        isActive: true,
    });

    const userRole = roleRepository.create({
        name: "user",
        description: "标准用户角色",
        isActive: true,
    });

    const permissions = [
        permissionRepository.create({
            name: "user:read",
            resource: "user",
            action: "read",
            description: "读取用户信息",
            isActive: true,
        }),
        permissionRepository.create({
            name: "user:write",
            resource: "user",
            action: "write",
            description: "写入用户信息",
            isActive: true,
        }),
        permissionRepository.create({
            name: "user:delete",
            resource: "user",
            action: "delete",
            description: "删除用户",
            isActive: true,
        }),
        permissionRepository.create({
            name: "role:read",
            resource: "role",
            action: "read",
            description: "读取角色信息",
            isActive: true,
        }),
        permissionRepository.create({
            name: "role:write",
            resource: "role",
            action: "write",
            description: "写入角色信息",
            isActive: true,
        }),
        permissionRepository.create({
            name: "permission:read",
            resource: "permission",
            action: "read",
            description: "读取权限信息",
            isActive: true,
        }),
    ];

    await permissionRepository.save(permissions);

    adminRole.permissions = permissions;
    userRole.permissions = permissions.filter((p) => p.name === "user:read");

    await roleRepository.save([adminRole, userRole]);

    const adminUser = userRepository.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        firstName: "管理员",
        lastName: "用户",
        isActive: true,
        roles: [adminRole],
    });

    const testUser = userRepository.create({
        username: "testuser",
        email: "test@example.com",
        password: hashedPassword,
        firstName: "测试",
        lastName: "用户",
        isActive: true,
        roles: [userRole],
    });

    await userRepository.save([adminUser, testUser]);

    console.log("数据库播种成功完成！");
}
