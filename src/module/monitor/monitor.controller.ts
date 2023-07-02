import { Controller, Get, Param, Query } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorQueryType } from './monitor.class';

@Controller('/monitor')
export class MonitorController {
    constructor(private readonly monitorService: MonitorService) {}

    @Get('/data')
    async getMemoryUseAge(@Query() param: MonitorQueryType) {
        return await this.monitorService.getMonitorInfo(param);
    }
}
