import { Inject, Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { appPkgExsit, getAppPkgList, writeToConfig } from 'src/utils/tool';
import { Service, ServiceConfig } from 'node-windows';
import { ServiceStatus, WinServiceConfig } from './winservice.class';
import { fstat, writeFileSync } from 'fs';
import { getServiceInfo } from 'src/utils/serviceinfo';

@Injectable()
export class WinServiceService {
    private readonly logger = new Logger(WinServiceService.name);
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

        // sync config
        this.syncServiceConfig();
    }

    // sync service status
    private async syncServiceConfig() {
        this.serviceList = this.serviceList.filter((app) => {
            // delete not exist  service object
            if (!this.serviceManager[app.name].exists) {
                delete this.serviceManager[app.name];
                return false;
            }
            return true;
        });

        // update service status
        for (let i = 0; i < this.serviceList.length; i++) {
            const app = this.serviceList[i];
            const { status, pid } = await getServiceInfo(`${app.name}.exe`);
            this.serviceList[i].status = status;
            this.serviceList[i].pid = pid;
        }

        this.logger.log(this.serviceList);

        // write to config file
        writeToConfig(this.serviceList);
    }

    public async getServiceList() {
        await this.syncServiceConfig();
        return this.serviceList;
    }

    public async getServiceInfo(name: string) {
        await this.syncServiceConfig();
        return this.serviceList.find((v) => v.name == name);
    }

    private async addService(config: ServiceConfig, service: Service) {
        const { status, pid } = await getServiceInfo(`${config.name}.exe`);
        const curServiceConfig = {
            name: config.name,
            config,
            status,
            pid,
        };
        this.serviceList.push(curServiceConfig);
        this.serviceManager[config.name] = service;
        writeToConfig(this.serviceList);
    }

    private removeService(name: string) {
        const existServiceList = this.serviceList.filter((app) => (app.name == name ? false : true));
        this.serviceList = existServiceList;
        delete this.serviceManager[name];
        writeToConfig(this.serviceList);
    }

    private updateServiceStatus(name: string, status: ServiceStatus) {
        this.serviceList = this.serviceList.map((app) => (app.name == name ? { ...app, status } : app));
        console.log(this.serviceList, '===');

        writeToConfig(this.serviceList);
    }

    // 注册 服务
    public async install(config: ServiceConfig) {
        // if (!appPkgExsit(config.name)) throw Error(`${config.name} 没上传`);

        if (this.serviceManager[config.name]) throw Error(`${config.name} 服务已注册!`);

        const curService = new Service(config);

        try {
            return await new Promise((rs, rj) => {
                curService.on('install', async () => {
                    curService.start();
                    curService.removeAllListeners();
                    await this.addService(config, curService);
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
        if (!this.serviceManager[name]) throw Error(`${name} 服务不存在!`);

        const curService = this.serviceManager[name];
        try {
            return await new Promise((rs, rj) => {
                curService.on('uninstall', () => {
                    // remove service
                    this.removeService(name);
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
        await this.start(name);
    }

    // 开始 服务
    public async start(name: string) {
        const curService = this.serviceManager[name];

        try {
            return await new Promise((rs, rj) => {
                curService.on('start', (err) => {
                    setTimeout(async () => {
                        await this.syncServiceConfig();
                        curService.removeAllListeners();
                        rs('启动成功!');
                    }, 1000);
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
                curService.on('stop', async (err) => {
                    setTimeout(async () => {
                        await this.syncServiceConfig();
                        curService.removeAllListeners();
                        rs('停止成功!');
                    }, 1000);
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
