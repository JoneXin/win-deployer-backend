import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { resolve } from 'path';

const conf = require(resolve('./config/mysql.config.json'));

export const mysqlConfig: SequelizeModuleAsyncOptions = {
    dialect: 'mysql' as Dialect,
    name: 'win_deployer',
    autoLoadModels: true,
    synchronize: false,
    timezone: '+08:00',
    logging: true,
    query: { raw: true },
    ...conf,
};
