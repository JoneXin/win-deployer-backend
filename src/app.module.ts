import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { RolesGuard } from './guards/role.guards';
import { HttpInterceptor } from './interceptor/http.interceptor';
import { PrograModule } from './module/program/program.module';
import { WinServiceModule } from './module/winservice/winservice.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';
import { mysqlConfig } from './config/mysql.config';
import { join, resolve } from 'path';
import { MonitorModule } from './module/monitor/monitor.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: resolve('./public'),
        }),
        SequelizeModule.forRoot(mysqlConfig),
        WinstonModule.forRootAsync({
            useFactory: () => ({}),
        }),
        PrograModule,
        WinServiceModule,
        MonitorModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpInterceptor,
        },
    ],
})
export class AppModule {}
