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

// apend service config
export const appendToConfig = (config: WinServiceConfig) => {
    let serviceConfig = require(appConfigPath);
    if (serviceConfig) {
        serviceConfig.push(config);
    } else {
        serviceConfig = [config];
    }
    console.log(serviceConfig, '==');

    writeFileSync(appConfigPath, JSON.stringify(serviceConfig, null, 4));
};

// rewirte service config
export const writeToConfig = (config: Array<WinServiceConfig>) => {
    writeFileSync(appConfigPath, JSON.stringify(config, null, 4));
};
