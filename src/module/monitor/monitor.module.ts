import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [SequelizeModule.forFeature([], 'win_deployer')],
    controllers: [MonitorController],
    providers: [MonitorService],
    exports: [],
})
export class MonitorModule {}
