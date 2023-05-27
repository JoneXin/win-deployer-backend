import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProgramService {
    constructor() {}
    getAppList() {
        return [
            {
                name: 'aaaaaaaaaaaaaaa',
                maxRetries: 9999,
                maxRestarts: 9999,
                description: 'test-service',
                script: 'E:/my-open-project/windows-deploy/test-server/bin/www',
                deployPath: 'E:/my-open-project/windows-deploy/test-server',
                grow: 0,
                wait: 3,
                status: '运行中',
                pid: 31424,
                versions: [
                    {
                        versionName: '1.0.1',
                        deployTime: '2023-03-12 13:20:76',
                        isCurrent: true,
                    },
                    {
                        versionName: '0.0.1',
                        deployTime: '2022-12-12 13:20:76',
                        isCurrent: false,
                    },
                ],
            },
        ];
    }
}
