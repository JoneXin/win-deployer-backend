import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadGatewayException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
    private readonly logger = new Logger(HttpInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 请求进来
        const request = context.switchToHttp().getRequest();
        const responce = context.switchToHttp().getResponse();

        const now = Date.now();
        return next.handle().pipe(
            tap((data) => {
                // 请求相应完后
                console.log('请求返回');

                return data;
            }),
            //   自定义全局错误补货
            catchError((err: Error) => {
                this.logger.error(err);
                return throwError(() => new HttpException(err.message, 500));
            }),
        );
    }
}
