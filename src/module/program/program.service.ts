import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProgramModel } from 'src/entity/program.entity';
import { VersionModel } from 'src/entity/version.eitity';
import { NewProgramInfo, ProgramConfigType } from './program.class';
import { appConfig } from '../../config/app.config';
import { writeFileSync, ensureDirSync, existsSync, copyFileSync, removeSync } from 'fs-extra';
import { basename, extname, join, resolve } from 'path';
import { compressFile, unCompressFile } from 'src/utils/compree';
import { WinServiceService } from '../winservice/winservice.service';

@Injectable()
export class ProgramService {
    constructor(
        private winServiceService: WinServiceService,
        @InjectModel(VersionModel, 'win_deployer')
        private readonly versionModel: typeof VersionModel,
        @InjectModel(ProgramModel, 'win_deployer')
        private readonly programModel: typeof ProgramModel,
    ) {}

    public async uninstallApp(name: string) {
        // 服务注销
        await this.winServiceService.unInstall(name);
        // 数据库 删除所有程序包和版本包
        await this.programModel.destroy({ where: { name } });
        await this.versionModel.destroy({ where: { name } });
        return true;
    }

    public async updateAppConfig(param: { name: string; version: string; config: Array<ProgramConfigType> }) {
        const { config, name, version } = param;
        await this.versionModel.update(
            {
                runningConfig: JSON.stringify(config),
            },
            {
                where: {
                    name,
                    version,
                },
            },
        );

        return true;
    }

    public saveFile(fileName: string, buffer: Buffer) {
        try {
            const savePath = resolve(appConfig.upload_path, 'temp');
            console.log(savePath);

            ensureDirSync(savePath);
            writeFileSync(join(savePath, fileName), buffer, 'utf-8');
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getAppList() {
        let appVersionList = await this.versionModel.findAll({
            group: ['name'],
        });
        let appList = [];

        let temp: any = {};
        for (let i = 0; i < appVersionList.length; i++) {
            const appConfig = appVersionList[i];
            const runningConf = await this.winServiceService.getServiceInfo(appConfig.name);
            if (temp.name != appConfig.name) {
                {
                    appList.push({
                        name: appConfig.name,
                        maxRetries: runningConf?.config.maxRetries,
                        maxRestarts: runningConf?.config.maxRestarts,
                        description: runningConf?.config.description,
                        script: join(appConfig.deployPath, appConfig.name, appConfig.execPath),
                        deployPath: appConfig.deployPath,
                        grow: runningConf?.config.grow,
                        wait: runningConf?.config.wait,
                        status: runningConf?.status,
                        pid: runningConf?.pid,
                        config: JSON.parse(appConfig.runningConfig),
                        versions: [
                            {
                                versionName: appConfig.version,
                                deployTime: new Date(appConfig.genTime).toLocaleString(),
                                isCurrent: appConfig.isCurrent ? true : false,
                            },
                        ],
                    });
                }
            } else {
                appList[appList.length - 1].versions = [
                    ...appList[appList.length - 1].versions,
                    {
                        versionName: appConfig.version,
                        deployTime: new Date(appConfig.genTime).toLocaleString(),
                        isCurrent: appConfig.isCurrent ? true : false,
                    },
                ];
            }

            temp = appConfig;
        }

        return appList;
    }

    // 新增应用
    public async addProgram(param: NewProgramInfo) {
        console.log(param);

        const { programPkg, config, versionName, deployPath, maxRestarts, maxRetries, execPath, desc } = param;
        const programName = programPkg.slice(0, programPkg.indexOf(extname(programPkg)));
        const programConfig = {
            name: programName,
            maxRestarts,
            maxRetries,
            description: desc,
            script: join(deployPath, programName, execPath),
        };
        // 更新配置文件
        const packagePath = await this.setConfig(programPkg, config, versionName);
        // 拷贝到 发布目录
        await this.copyPkgToTargetPath(packagePath, deployPath, programPkg);
        // 启动服务
        this.winServiceService.install(programConfig);
        //回写数据库
        const transaction = await this.programModel.sequelize.transaction();
        try {
            await this.programModel.bulkCreate([{ name: programName, desc }], { transaction });
            await this.versionModel.bulkCreate(
                [
                    {
                        name: programName,
                        version: versionName,
                        deployPath,
                        execPath,
                        packagePath,
                        isCurrent: 1,
                        genTime: Date.now(),
                        runningConfig: JSON.stringify(config),
                        programConfig: JSON.stringify(programConfig),
                    },
                ],
                { transaction },
            );

            transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(err);
        }

        return true;
    }

    // 替换配置
    private async setConfig(pkgName: string, config: Array<ProgramConfigType>, version: string): Promise<string> {
        const filePath = resolve(appConfig.upload_path, 'temp', pkgName);
        const programName = pkgName.slice(0, pkgName.indexOf(extname(pkgName)));
        const savePath = resolve(appConfig.upload_path, programName, version);
        //  解压
        await unCompressFile(filePath, savePath);
        // 替换配置文件
        if (config) {
            for (let i = 0; i < config.length; i++) {
                const fileConfig = config[i];
                writeFileSync(resolve(savePath, programName, fileConfig.configPath), fileConfig.configContent, 'utf-8');
            }
        }
        // 压缩
        await compressFile(join(savePath, programName), join(savePath, pkgName));

        // 删除残余文件夹
        removeSync(join(savePath, programName));

        return join(savePath, pkgName);
    }

    private async copyPkgToTargetPath(source: string, desc: string, pkgName: string) {
        const programName = pkgName.slice(0, pkgName.indexOf(extname(pkgName)));
        const targetZipPath = join(desc, pkgName);
        // eg: E:/.temp/appName
        if (existsSync(join(desc, programName))) {
            throw new Error(`${join(desc, programName)} 已存在!!`);
        }

        //eg: source/appName.zip =>  E:/.temp/appName.zip
        copyFileSync(source, targetZipPath);

        // 解压到指定目录
        await unCompressFile(targetZipPath, desc);

        // 删除压缩包
        removeSync(targetZipPath);
    }
}
