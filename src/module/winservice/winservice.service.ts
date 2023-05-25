import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { appPkgExsit, getAppPkgList, saveToConfig } from 'src/utils/tool';
import { Service, ServiceConfig } from 'node-windows';
import { ServiceStatus, WinServiceConfig } from './winservice.class';
import { fstat, writeFileSync } from 'fs';

@Injectable()
export class WinServiceService {
    private serviceList: WinServiceConfig[] = [];
    private serviceManager: Record<string, Service> = {};

    constructor() {
        this.initServiceList();
    }

    private initServiceList() {
        this.serviceList = getAppPkgList();

        // init service manager
        this.serviceList.forEach((serverConf: WinServiceConfig) => {
            this.serviceManager[serverConf.name] = new Service(serverConf.config);
        });
    }

    public getServiceList() {
        return this.serviceList;
    }

    // 注册 服务
    public async install(config: ServiceConfig) {
        // if (!appPkgExsit(config.name)) throw Error(`${config.name} 没上传`);

        if (this.serviceManager[config.name]) throw Error(`${config.name} 服务已注册!`);

        this.serviceManager[config.name] = new Service(config);

        const curService = this.serviceManager[config.name];

        try {
            return await new Promise((rs, rj) => {
                curService.on('install', () => {
                    curService.start();
                    curService.removeAllListeners();
                    saveToConfig(config);
                    rs('注册成功!');
                });
                curService.on('alreadyinstalled', () => {
                    curService.removeAllListeners();
                    rj('已经注册过!');
                });
                curService.on('error', (err) => {
                    curService.removeAllListeners();
                    rj(`注册失败: ${err}`);
                });

                curService.install();
            });
        } catch (error) {
            throw Error(error);
        }
    }

    // 注销 服务
    public async unInstall(name: string) {
        console.log(name);

        if (!this.serviceManager[name]) throw Error(`${name} 服务不存在!`);

        const curService = this.serviceManager[name];

        try {
            return await new Promise((rs, rj) => {
                curService.on('uninstall', () => {
                    curService.removeAllListeners();
                    rs('注销成功!');
                });
                curService.on('error', (err) => {
                    curService.removeAllListeners();
                    console.log(err);

                    rs(`注册失败: ${err}`);
                });

                curService.on('alreadyuninstalled', () => {
                    curService.removeAllListeners();
                    rs(`${name}服务 不存在!`);
                });

                curService.uninstall();
            });
        } catch (error) {
            throw Error(error);
        }
    }

    // 重启 服务
    public async restart(name: string) {
        await this.stop(name);

        return new Promise((rs, rj) => {
            setTimeout(async () => {
                rs(await this.start(name));
            }, 3000);
        });
    }

    // 开始 服务
    public async start(name: string) {
        const curService = this.serviceManager[name];

        try {
            return await new Promise((rs, rj) => {
                curService.on('start', (err) => {
                    curService.removeAllListeners();
                    rs('启动成功!');
                });

                curService.on('error', (err) => {
                    curService.removeAllListeners();
                    rj(`${err}`);
                });

                curService.start();
            });
        } catch (error) {
            throw Error(error);
        }
    }

    // 停止 服务
    public async stop(name: string) {
        const curService = this.serviceManager[name];
        try {
            return await new Promise((rs, rj) => {
                curService.on('stop', (err) => {
                    curService.removeAllListeners();
                    rs('停止成功!');
                });

                curService.on('error', (err) => {
                    curService.removeAllListeners();
                    rj(`${err}`);
                });

                curService.stop();
            });
        } catch (error) {
            throw Error(error);
        }
    }
}
