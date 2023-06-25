import { getProcessCpuInfo, getProcessMemoryInfo } from '../../src/utils/monitor';

getProcessMemoryInfo('app_server').then((res) => {
    console.log(res);
});

getProcessCpuInfo('app_server').then((res) => {
    console.log(res);
});
