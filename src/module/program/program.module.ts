import { Module } from '@nestjs/common';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';

@Module({
    imports: [],
    controllers: [ProgramController],
    providers: [ProgramService],
})
export class PrograModule {}
