import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProgramService {
    constructor() {}
    getHello(): string {
        return '12';
    }
}
