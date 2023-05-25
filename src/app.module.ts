import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './guards/role.guards';
import { HttpInterceptor } from './interceptor/http.interceptor';
import { PrograModule } from './module/program/program.module';
import { WinServiceModule } from './module/winservice/winservice.module';

@Module({
    imports: [PrograModule, WinServiceModule],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpInterceptor,
        },
    ],
})
export class AppModule {}
