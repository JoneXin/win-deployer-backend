const appConf = require('../../config/app.config.json');

type AppConf = {
    port: number;
    logs: {
        max_size: string;
        max_files: string;
        dirname: string;
    };
};

export const appConfig: AppConf = {
    ...appConf,
};
