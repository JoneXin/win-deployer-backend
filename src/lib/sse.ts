import { INestApplication, Injectable } from '@nestjs/common';
import * as SSE from 'express-sse';

export class SSe {
    static sse: SSE;

    static use(app: INestApplication, path: string) {
        SSe.sse = new SSE();
        app.use(path, SSe.sse.init);
    }

    static send(msg: any) {
        SSe.sse.send(msg);
    }
}
