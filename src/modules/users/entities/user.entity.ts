import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { Role } from '../../roles/entities/role.entity';
import { Exclude } from "class-transformer";

@Entity("users")
export class User {
    /** 用户ID */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /** 用户名 */
    @Column({ unique: true, length: 50 })
    username: string;

    /** 邮箱 */
    @Column({ unique: true, length: 100 })
    email: string;

    /** 密码 */
    @Exclude()
    @Column({ length: 255 })
    password: string;

    /** 名 */
    @Column({ length: 50, nullable: true })
    firstName: string;

    /** 姓 */
    @Column({ length: 50, nullable: true })
    lastName: string;

    /** 是否激活 */
    @Column({ default: true })
    isActive: boolean;

    /** 最后登录时间 */
    @Column({ nullable: true })
    lastLoginAt: Date;

    /** 创建时间 */
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    /** 更新时间 */
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    /** 用户角色关联 */
    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: "user_roles",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
    })
    roles: Role[];
}
