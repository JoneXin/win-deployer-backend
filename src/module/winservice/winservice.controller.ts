import {
    Body,
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
import { WinServiceService } from './winservice.service';
import { ServiceConfig } from 'node-windows';

@Controller('/service')
export class WinServiceController {
    constructor(private readonly winServiceService: WinServiceService) {}

    @Get('/')
    getHello() {
        return this.winServiceService.getServiceList();
    }

    @Post('/install')
    async installApp(@Body() config: ServiceConfig) {
        return await this.winServiceService.install(config);
    }

    // @Get('/uninstall')
    // async uninstall(@Query('name') name: string) {
    //     return await this.winServiceService.unInstall(name);
    // }

    @Get('/restart')
    async restart(@Query('name') name: string) {
        return await this.winServiceService.restart(name);
    }

    @Get('/start')
    async start(@Query('name') name: string) {
        return await this.winServiceService.start(name);
    }

    @Get('/stop')
    async stop(@Query('name') name: string) {
        return await this.winServiceService.stop(name);
    }
}
