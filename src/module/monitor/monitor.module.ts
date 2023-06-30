import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { cpu } from '../../entity/cpu';
import { memory } from '../../entity/memory';

@Module({
    imports: [SequelizeModule.forFeature([cpu, memory], 'win_deployer')],
    controllers: [MonitorController],
    providers: [MonitorService],
    exports: [],
})
export class MonitorModule {}
