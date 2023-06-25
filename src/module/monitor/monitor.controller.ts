import { Controller, Get, Param } from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller('/monitor')
export class MonitorController {
    constructor(private readonly monitorService: MonitorService) {}

    @Get('/cpu')
    getCpuUseAge(@Param() serverName: string) {
        return this.monitorService.getCpuUseAge(serverName);
    }

    @Get('/memory')
    getMemoryUseAge(@Param() serverName: string) {
        return this.monitorService.getMemoryUseAge(serverName);
    }
}
