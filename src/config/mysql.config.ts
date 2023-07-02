import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { resolve } from 'path';
import { readFileSync } from 'fs-extra';
const mysql2 = require('mysql2');
const mysqlConf = readFileSync(resolve('./config/mysql.config.json'));

export const mysqlConfig: SequelizeModuleAsyncOptions = {
    dialect: 'mysql' as Dialect,
    name: 'win_deployer',
    autoLoadModels: true,
    synchronize: true,
    timezone: '+08:00',
    logging: true,
    query: { raw: true },
    dialectModule: mysql2,
    ...JSON.parse(mysqlConf.toString()),
};
