import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs-extra';
import { resolve } from 'path';
const pkg = JSON.parse(readFileSync(resolve('./package.json')).toString());

export const setSwaggerDocument = (app: INestApplication) => {
    const options = new DocumentBuilder()
        .setTitle('接口文档')
        .setDescription(`《${pkg.name} api服务端》接口文档`)
        .setVersion(pkg.version)
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/doc', app, document);
};
