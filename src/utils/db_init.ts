import { resolve } from 'path';

const { join } = require('path');
const fs = require('fs');
const sequelize = require('sequelize');
const mysqlConfig = require(resolve('./config/mysql.config.json'));
const sqlPath = join(resolve('./sql'));

function getSeqInstance() {
    return new sequelize({
        dialect: 'mysql',
        synchronize: false,
        timezone: '+08:00',
        logging: false,
        query: { raw: true },
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        username: mysqlConfig.username,
        password: mysqlConfig.password,
    });
}

/**
 * 初始化 lia_web_roll
 * @returns {Promise<boolean>}
 */
export async function initLiaWebRoll() {
    const seq = getSeqInstance();
    const dir = fs.opendirSync(sqlPath);
    const transaction = await seq.transaction();

    try {
        for await (const dirent of dir) {
            const initSql = fs.readFileSync(join(sqlPath, dirent.name)).toString();
            console.log(initSql);
            const sqlps = initSql.split(';').filter((s) => !!s.trim());

            for (let i = 0; i < sqlps.length; i++) {
                await seq.query(sqlps[i], { transaction });
            }
        }
        console.log('初始化数据库成功！');
        transaction.commit();
    } catch (err) {
        await transaction.rollback();
        console.log(err);
    }

    return true;
}
