import { ServiceConfig } from 'node-windows';

export enum ServiceStatus {
    'UN_INSTALL' = '未注册',
    'STOP' = '停止',
    'START' = '运行中',
}

export type WinServiceConfig = {
    name: string;
    config: ServiceConfig;
    status: ServiceStatus;
};
