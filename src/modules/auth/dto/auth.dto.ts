import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: '邮箱' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: '用户名' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'john@example.com', description: '邮箱' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh_token_here', description: '刷新令牌' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'access_token_here', description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ example: 'refresh_token_here', description: '刷新令牌' })
  refreshToken: string;

  @ApiProperty({ example: 'user_id', description: '用户ID' })
  userId: string;
}
