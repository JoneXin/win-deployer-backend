import { ServiceStatus } from 'src/module/winservice/winservice.class';

var cmd = require('node-cmd');

// get service status
export const getServiceStatus = async (name: string): Promise<ServiceStatus> => {
    try {
        const res = await new Promise((reslove, reject) => {
            cmd.run(`sc query ${name}`, function (err, data, stderr) {
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
                reslove(status);
            });
        });

        if (res == 'STOPPED') {
            return ServiceStatus.STOP;
        }

        if (res == 'RUNNING') {
            return ServiceStatus.START;
        }

        throw new Error(res as string);
    } catch (error) {
        throw new Error(error);
    }
};
