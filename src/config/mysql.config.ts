const conf = require('../../config/mysql.config.json');
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

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
