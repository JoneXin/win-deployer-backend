import { Module } from '@nestjs/common';
import { WinServiceController } from './winservice.controller';
import { WinServiceService } from './winservice.service';

@Module({
    imports: [],
    controllers: [WinServiceController],
    providers: [WinServiceService],
    exports: [WinServiceService],
})
export class WinServiceModule {}
