import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'user:read', description: '权限名称' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'user', description: '资源名称' })
  @IsString()
  @MaxLength(50)
  resource: string;

  @ApiProperty({ example: 'read', description: '操作名称' })
  @IsString()
  @MaxLength(20)
  action: string;

  @ApiPropertyOptional({ example: 'Read user information', description: '权限描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ example: true, description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePermissionDto {
  @ApiPropertyOptional({ example: 'user:read', description: '权限名称' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'user', description: '资源名称' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  resource?: string;

  @ApiPropertyOptional({ example: 'read', description: '操作名称' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  action?: string;

  @ApiPropertyOptional({ example: 'Read user information', description: '权限描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ example: true, description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
