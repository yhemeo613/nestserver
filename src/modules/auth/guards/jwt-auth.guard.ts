/*
 * @Author: dzy dzyperson@163.com
 * @Date: 2026-01-22 10:55:27
 * @LastEditors: dzy dzyperson@163.com
 * @LastEditTime: 2026-01-22 11:22:24
 * @FilePath: \nestjs服务架构\src\modules\auth\guards\jwt-auth.guard.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "../../../common/decorators/auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private reflector: Reflector) {
        super();
    }

    /**
     * 检查是否需要跳过JWT验证（公共接口）
     * @param context 执行上下文
     */
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }
}
