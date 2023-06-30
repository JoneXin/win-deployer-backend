import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { appConfig } from 'src/config/app.config';
import { ScheduleQueue } from '../../utils/queue';
import { getProcessCpuInfo, getProcessMemoryInfo } from 'src/utils/monitor';
import { InjectModel } from '@nestjs/sequelize';
import { cpu as CpuModel } from '../../entity/cpu';
import { memory as MemoryModel } from '../../entity/memory';
import { ProgramModel } from '../../entity/program.entity';
@Injectable()
export class MonitorService {
    private readonly logger = new Logger(MonitorService.name);
    private readonly taskQueue = new ScheduleQueue('monitor');

    constructor(
        @InjectModel(CpuModel, 'win_deployer')
        private readonly cpuModel: typeof CpuModel,
        @InjectModel(MemoryModel, 'win_deployer')
        private readonly memoryModel: typeof MemoryModel,
        @InjectModel(ProgramModel, 'win_deployer')
        private readonly programModel: typeof ProgramModel,
    ) {}

    async getMonitorInfo(serverName: string) {}

    @Cron(appConfig.collect_monitor_corn)
    async collectCpuData(serverList: Array<string>) {
        // 查询程序列表
        const processList = await this.getProcessList();
        // 采集上传任务 放入队列
        processList.forEach((program) => {
            this.taskQueue.addTask(this.handleMonitorData.bind(this, program.name));
        });
    }

    /**
     * 获取程序列表
     * @returns
     */
    async getProcessList(): Promise<Array<ProgramModel>> {
        try {
            return await this.programModel.findAll();
        } catch (_) {
            this.logger.error(_);
            return [];
        }
    }

    /**
     * 采集指定进程名的 cpu和内存数据
     * @param serverName
     */
    async handleMonitorData(serverName: string) {
        // 获取指定进程资源数据
        const cpuInfo = await getProcessCpuInfo(serverName);
        const memoryInfo = await getProcessMemoryInfo(serverName);
        // cpu
        await this.cpuModel.bulkCreate([
            { cpuProcessUsed: cpuInfo.processCpuUse, cpuUsed: cpuInfo.cpuUse, time: Date.now() },
        ]);
        // memroy
        await this.memoryModel.bulkCreate([
            {
                memoryProcessUsed: memoryInfo.processmemoryUseUse,
                memorySum: memoryInfo.memorySum,
                time: Date.now(),
                memoryUsed: memoryInfo.memoryUse,
            },
        ]);
    }
}
