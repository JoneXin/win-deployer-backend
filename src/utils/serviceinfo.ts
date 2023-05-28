import e from 'express';
import { ServiceStatus } from '../module/winservice/winservice.class';

var cmd = require('node-cmd');

// get service status
export const getServiceInfo = async (name: string): Promise<{ status: ServiceStatus; pid: number }> => {
    try {
        const res: any = await new Promise((reslove, reject) => {
            cmd.run(`sc queryex ${name}`, function (err, data, stderr) {
                if (err) {
                    reject(err);
                }

                if (stderr) {
                    reject(stderr);
                }

                const status = data
                    .split('\r\n')
                    .filter((v) => !!v)[2]
                    .split(':')[1]
                    .trim()
                    .split(' ')[2];
                console.log(status, 'status');

                const pid = data
                    .split('\r\n')
                    .filter((v) => !!v)[8]
                    .split(':')[1];

                reslove({ status, pid: Number(pid) });
            });
        });

        if (res.status == 'STOPPED') {
            return { status: ServiceStatus.STOP, pid: res.pid };
        }

        if (res.status == 'RUNNING') {
            return { status: ServiceStatus.START, pid: res.pid };
        }

        throw new Error(res as string);
    } catch (error) {
        throw new Error(error);
    }
};

// get process detail info
export const getProcessDetail = async (pid: number) => {};
