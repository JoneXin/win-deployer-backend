import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guards';
import { HttpInterceptor } from './interceptor/http.interceptor';
import { JoneXinLogger } from './lib/logger';
import { appConfig } from './config/app.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new JoneXinLogger(),
    });

    await app.listen(appConfig.port, '0.0.0.0', () => {
        console.log(`server running success in http://127.0.0.1:${appConfig.port}`);
        console.log(`swagger document running in http://127.0.0.1:${appConfig.port}/doc`);
    });
}
bootstrap();
