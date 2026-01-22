import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';
import { RefreshToken as RefreshTokenEntity } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('凭证无效');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('用户账户未激活');
    }

    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`用户登录: ${user.id}`);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`用户注册: ${user.id}`);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken, isActive: true },
      });

      if (!tokenEntity || tokenEntity.expiresAt < new Date()) {
        throw new UnauthorizedException('无效或过期的刷新令牌');
      }

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('用户未找到或未激活');
      }

      await this.refreshTokenRepository.update(tokenEntity.id, { isActive: false });

      const tokens = await this.generateTokens(user);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      this.logger.log(`令牌已刷新: ${user.id}`);
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user.id,
      };
    } catch (error) {
      throw new UnauthorizedException('无效的刷新令牌');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );
    this.logger.log(`用户登出: ${userId}`);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles?.map((role) => role.name) || [],
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN')),
    );

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);
  }
}
