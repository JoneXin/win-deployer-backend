import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JoneXinLogger } from './lib/logger';
import { appConfig } from './config/app.config';
import { initLiaWebRoll } from './utils/db_init';

async function bootstrap() {
    // db init
    await initLiaWebRoll();

    // app init
    const app = await NestFactory.create(AppModule, {
        logger: new JoneXinLogger(),
    });

    app.setGlobalPrefix('api');

    await app.listen(appConfig.port, '0.0.0.0', () => {
        console.log(`server running success in http://127.0.0.1:${appConfig.port}`);
        console.log(`swagger document running in http://127.0.0.1:${appConfig.port}/doc`);
    });
}
bootstrap();
