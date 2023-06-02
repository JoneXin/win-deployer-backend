import { resolve } from 'path';
import { readFileSync } from 'fs';
const appConf = readFileSync(resolve('./config/app.config.json'));

type AppConf = {
    port: number;
    logs: {
        max_size: string;
        max_files: string;
        dirname: string;
    };
    upload_path: string;
};

export const appConfig: AppConf = {
    ...JSON.parse(appConf.toString()),
};
