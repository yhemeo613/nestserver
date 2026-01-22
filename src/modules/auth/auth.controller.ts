import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, RefreshTokenDto, AuthResponseDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Public } from "../../common/decorators/auth.decorator";

@ApiTags("认证管理")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "用户登录" })
    @ApiResponse({ status: 200, description: "登录成功", type: AuthResponseDto })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @Public()
    @Post("register")
    @ApiOperation({ summary: "用户注册" })
    @ApiResponse({ status: 201, description: "注册成功", type: AuthResponseDto })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "刷新访问令牌" })
    @ApiResponse({ status: 200, description: "令牌刷新成功", type: AuthResponseDto })
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
        return this.authService.refreshToken(refreshTokenDto);
    }

    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "用户登出" })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req) {
        await this.authService.logout(req.user.userId);
    }

    @Get("profile")
    @ApiOperation({ summary: "获取当前用户个人资料" })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return req.user;
    }
}
