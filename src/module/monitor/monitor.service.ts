import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { appConfig } from 'src/config/app.config';
import { ScheduleQueue } from '../../utils/queue';
import { getProcessCpuInfo } from 'src/utils/monitor';

@Injectable()
export class MonitorService {
    private readonly logger = new Logger(MonitorService.name);
    private readonly taskQueue = new ScheduleQueue('monitor');

    constructor() {}

    getCpuUseAge(serverName: string) {}

    getMemoryUseAge(serverName: string) {}

    @Cron(appConfig.collect_monitor_corn)
    async collectCpuData(serverList: Array<string>) {
        // 查询程序列表
        // 采集上传任务 放入队列
    }

    @Cron(appConfig.collect_monitor_corn)
    async collectMemoryData(serverList: Array<string>) {}

    async getCpuMonitorData(serverName: string) {
        const cpuInfo = await getProcessCpuInfo(serverName);
    }
}
