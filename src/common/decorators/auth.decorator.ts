import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * 角色装饰器
 * @param roles 角色列表
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const PERMISSIONS_KEY = 'permissions';
/**
 * 权限装饰器
 * @param permissions 权限列表
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const PUBLIC_KEY = 'isPublic';
/**
 * 公共接口装饰器（跳过认证）
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
