// import { Inject, Injectable } from '@nestjs/common';
// import { TestClass } from './custom_provider/test.service';
// import { Conn } from './custom_provider/conn.service';
// import { Cron } from '@nestjs/schedule';
// import { SSe } from './lib/sse';

// @Injectable()
// export class AppService {
//     constructor(@Inject() private t: TestClass, @Inject() private conn: Conn) {}
//     getHello(): string {
//         const a = this.conn.getConn();
//         console.log(a);
//         SSe.send('22');
//         return this.t.geName();
//     }
// }
