/*
 * @Author: dzy dzyperson@163.com
 * @Date: 2026-01-22 10:55:19
 * @LastEditors: dzy dzyperson@163.com
 * @LastEditTime: 2026-01-22 11:37:10
 * @FilePath: \nestjs服务架构\src\modules\auth\strategies\local.strategy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            usernameField: "email",
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException("凭证无效");
        }

        const isPasswordValid = await this.usersService.validatePassword(user, password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("凭证无效");
        }

        if (!user.isActive) {
            throw new UnauthorizedException("用户账号未激活");
        }

        return user;
    }
}
