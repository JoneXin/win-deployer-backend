import { Controller, Get, Param } from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller('/monitor')
export class MonitorController {
    constructor(private readonly monitorService: MonitorService) {}

    @Get('/monitor')
    async getMemoryUseAge(@Param() serverName: string) {
        return await this.monitorService.getMonitorInfo(serverName);
    }
}
