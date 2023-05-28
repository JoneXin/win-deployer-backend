import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProgramModel } from 'src/entity/program.entity';
import { VersionModel } from 'src/entity/version.eitity';
import { WinServiceModule } from '../winservice/winservice.module';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';

@Module({
    imports: [WinServiceModule, SequelizeModule.forFeature([VersionModel, ProgramModel], 'win_deployer')],
    controllers: [ProgramController],
    providers: [ProgramService],
})
export class PrograModule {}
