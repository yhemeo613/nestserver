import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: '角色名称' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: 'Administrator role', description: '角色描述' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiPropertyOptional({ example: true, description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'admin', description: '角色名称' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: 'Administrator role', description: '角色描述' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiPropertyOptional({ example: true, description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AssignPermissionsDto {
  @ApiProperty({ example: ['user:read', 'user:write'], description: '权限ID列表' })
  @IsString({ each: true })
  permissionIds: string[];
}
