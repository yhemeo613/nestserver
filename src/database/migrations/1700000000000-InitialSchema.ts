import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
    name = "InitialSchema1700000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "firstName",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "lastName",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "lastLoginAt",
                        type: "datetime",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex("users", new TableIndex({ columnNames: ["email"], name: "IDX_USER_EMAIL" }));

        await queryRunner.createTable(
            new Table({
                name: "roles",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "permissions",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                    },
                    {
                        name: "resource",
                        type: "varchar",
                        length: "50",
                    },
                    {
                        name: "action",
                        type: "varchar",
                        length: "20",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "200",
                        isNullable: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "user_roles",
                columns: [
                    {
                        name: "user_id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                    },
                    {
                        name: "role_id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "user_roles",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "user_roles",
            new TableForeignKey({
                columnNames: ["role_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "roles",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: "role_permissions",
                columns: [
                    {
                        name: "role_id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                    },
                    {
                        name: "permission_id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "role_permissions",
            new TableForeignKey({
                columnNames: ["role_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "roles",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "role_permissions",
            new TableForeignKey({
                columnNames: ["permission_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "permissions",
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: "refresh_tokens",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "userId",
                        type: "varchar",
                        length: "36",
                    },
                    {
                        name: "token",
                        type: "varchar",
                        length: "500",
                    },
                    {
                        name: "expiresAt",
                        type: "datetime",
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "refresh_tokens",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("refresh_tokens");
        await queryRunner.dropTable("role_permissions");
        await queryRunner.dropTable("user_roles");
        await queryRunner.dropTable("permissions");
        await queryRunner.dropTable("roles");
        await queryRunner.dropTable("users");
    }
}
