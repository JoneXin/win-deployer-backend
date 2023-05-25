import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Res,
    SetMetadata,
    Sse,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ProgramService } from './program.service';

@Controller('/program')
export class ProgramController {
    constructor(private readonly programService: ProgramService) {}

    @Get('/')
    getHello(@Query() p: string): string {
        return this.programService.getHello();
    }
}
