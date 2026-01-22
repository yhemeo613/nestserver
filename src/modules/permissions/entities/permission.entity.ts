import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('permissions')
export class Permission {
  /** 权限ID */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 权限名称 */
  @Column({ unique: true, length: 100 })
  name: string;

  /** 资源 */
  @Column({ length: 50 })
  resource: string;

  /** 动作 */
  @Column({ length: 20 })
  action: string;

  /** 描述 */
  @Column({ length: 200, nullable: true })
  description: string;

  /** 是否激活 */
  @Column({ default: true })
  isActive: boolean;

  /** 创建时间 */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /** 更新时间 */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /** 关联角色 */
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
