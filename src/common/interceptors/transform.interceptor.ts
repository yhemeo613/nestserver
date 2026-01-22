/*
 * @Author: dzy dzyperson@163.com
 * @Date: 2026-01-22 10:47:53
 * @LastEditors: dzy dzyperson@163.com
 * @LastEditTime: 2026-01-22 11:42:41
 * @FilePath: \nestjs服务架构\src\common\interceptors\transform.interceptor.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseDto } from "../dto/response.dto";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
        return next.handle().pipe(
            map((data) => {
                if (data instanceof ResponseDto) {
                    return data;
                }
                // 统一包装响应数据
                return ResponseDto.success(data);
            }),
        );
    }
}
