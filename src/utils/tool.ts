import * as fs from 'fs';
import { writeFileSync } from 'fs';
import { readFileSync } from 'fs-extra';
import { ServiceConfig } from 'node-windows';
import { join, resolve } from 'path';
import { ServiceStatus, WinServiceConfig } from 'src/module/winservice/winservice.class';

const appConfigPath = resolve('./.running/appList.json');

export const getAppPkgList = (): Array<WinServiceConfig> => {
    return JSON.parse(readFileSync(appConfigPath).toString()) as Array<WinServiceConfig>;
};

export const appPkgExsit = (name: string): boolean => {
    return fs.existsSync(join(__dirname, '../../pkg/', name));
};

// rewirte service config
export const writeToConfig = (config: Array<WinServiceConfig>) => {
    writeFileSync(appConfigPath, JSON.stringify(config, null, 4));
};
