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
import { join } from 'path';
@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../public'),
        }),
        SequelizeModule.forRoot(mysqlConfig),
        WinstonModule.forRootAsync({
            useFactory: () => ({}),
        }),
        PrograModule,
        WinServiceModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: HttpInterceptor,
        },
    ],
})
export class AppModule {}
