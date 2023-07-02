import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { cpu } from '../../entity/cpu';
import { memory } from '../../entity/memory';
import { ProgramModel } from '../../entity/program.entity';

@Module({
    imports: [SequelizeModule.forFeature([cpu, memory, ProgramModel], 'win_deployer')],
    controllers: [MonitorController],
    providers: [MonitorService],
    exports: [MonitorService],
})
export class MonitorModule {}
