import * as fs from 'fs';
import { writeFileSync } from 'fs';
import { ServiceConfig } from 'node-windows';
import { join } from 'path';
import { ServiceStatus, WinServiceConfig } from 'src/module/winservice/winservice.class';

const appConfigPath = join(__dirname, '../../.running/appList.json');

export const getAppPkgList = (): Array<WinServiceConfig> => {
    return require(appConfigPath) as Array<WinServiceConfig>;
};

export const appPkgExsit = (name: string): boolean => {
    return fs.existsSync(join(__dirname, '../../pkg/', name));
};

export const saveToConfig = (config: ServiceConfig) => {
    let serviceConfig = require(appConfigPath);
    if (serviceConfig) {
        serviceConfig.push({
            name: config.name,
            config,
            status: ServiceStatus.START,
        });
    } else {
        serviceConfig = [
            {
                name: config.name,
                config,
                status: ServiceStatus.START,
            },
        ];
    }

    writeFileSync(appConfigPath, JSON.stringify(serviceConfig, null, 4));
};
