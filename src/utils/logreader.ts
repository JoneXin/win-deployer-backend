import * as readline from 'readline';
import { createReadStream } from 'fs';
import { LogsReaderConf } from 'src/module/program/program.class';

/**
 * 只支持 一下日志格式的
 * line: 2023-05-29 15:09:30 日志内容
 * @param path
 * @param startTime
 * @param endTime
 * @returns
 */
export const LogReader = async (logConfg: LogsReaderConf) => {
    const { logsPath: path, startTime, endTime, pageNumber, pageSize } = logConfg;

    const readerStream = createReadStream(path);
    const rl = readline.createInterface(readerStream);
    const logsContentList = [];
    let valideLogstag = false;
    let valideLogsCount = 0;

    let dataStr = '';
    await new Promise((resolve, reject) => {
        rl.on('line', (data) => {
            dataStr = data.slice(0, 20);

            if (dataStr >= startTime && dataStr <= endTime) {
                valideLogsCount++;
            }

            if (valideLogsCount - 1 == pageSize * (pageNumber - 1)) {
                valideLogstag = true;
            }

            if (valideLogstag) {
                logsContentList.push(data);
            }

            if (valideLogsCount == pageSize * pageNumber) {
                valideLogstag = false;
            }

            // 索引到 搜索结束时间，关闭
            if (dataStr > endTime) {
                rl.close();
            }
        });

        rl.on('close', () => {
            resolve(logsContentList);
        });
    });

    return {
        logsContentList,
        count: valideLogsCount,
    };
};
