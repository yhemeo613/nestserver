import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role {
  /** 角色ID */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 角色名称 */
  @Column({ unique: true, length: 50 })
  name: string;

  /** 角色描述 */
  @Column({ length: 100, nullable: true })
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

  /** 关联用户 */
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  /** 关联权限 */
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
