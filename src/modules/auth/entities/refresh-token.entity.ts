import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("refresh_tokens")
export class RefreshToken {
    /** 刷新令牌ID */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /** 用户ID */
    @Column()
    userId: string;

    /** 令牌内容 */
    @Column({ type: "text" })
    token: string;

    /** 过期时间 */
    @Column()
    expiresAt: Date;

    /** 是否激活 */
    @Column({ default: true })
    isActive: boolean;

    /** 创建时间 */
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    /** 更新时间 */
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
