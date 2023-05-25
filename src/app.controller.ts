// import {
//     Controller,
//     Get,
//     Param,
//     ParseIntPipe,
//     Post,
//     Query,
//     Res,
//     SetMetadata,
//     Sse,
//     UseGuards,
//     ValidationPipe,
// } from '@nestjs/common';
// import { AppService } from './app.service';
// import { UserTransFromPipe } from './pipes/name.pipe';

// import { RolesGuard } from './guards/role.guards';
// import { Roles, User } from './decorator/role.decorator';
// import { Observable, interval, map } from 'rxjs';
// import { Response } from 'express';
// import { readFileSync } from 'fs';
// import { join } from 'path';

// @Controller()
// export class AppController {
//     constructor(private readonly appService: AppService) {}

//     @Get('/test')
//     getHello(@Query(UserTransFromPipe) p: string): string {
//         console.log('转换后', p);

//         return this.appService.getHello();
//     }

//     /**
//      * 更细粒度的
//      * @param userInfo
//      * @returns
//      */
//     @Get('/user')
//     @Roles('admin', 'manager')
//     getUsers(@Query() userInfo: any): string {
//         return userInfo;
//     }

//     @Get('/err')
//     testErr(): string {
//         throw new Error('asdas错了');
//     }

//     @Post('/set_user') // 通过自定一装饰器 拿到post 请求 参数中 user.name
//     setUser(@User('name') name: string): string {
//         return name;
//     }

//     @Get()
//     index(@Res() response: Response) {
//         response.type('text/html').send(readFileSync(join(__dirname, '../index.html')).toString());
//     }

//     /**
//      * 与WebSockets不同，服务器发送的事件是单向的；也就是说，数据消息是单向传递的，从服务器到客户端（例如用户的网络浏览器）。
//      * 当不需要以消息形式从客户端向服务器发送数据时，这使它们成为一个极好的选择。
//      * 例如，EventSource这是一种处理社交媒体状态更新、新闻提要或将数据传送到客户端存储机制
//      * 如IndexedDB或网络存储,中的有用方法。
//      */
//     // @Sse('sse')
//     // sse(): Observable<MessageEvent> {
//     //   return interval(1000).pipe(
//     //     map((_) => ({ data: { hello: 'world' } } as MessageEvent)),
//     //   );
//     // }
// }
