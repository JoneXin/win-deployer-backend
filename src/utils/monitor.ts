var cmd = require('node-cmd');

type CpuMonitorType = {
    cpuUse: number;
    processCpuUse: number;
};

type MemoryMonitorType = {
    memorySum: number;
    memoryUse: number;
    processmemoryUseUse: number;
};

// 执行 cmd命令
export const execCmd = async (command: string): Promise<string> => {
    try {
        return await new Promise((reslove, reject) => {
            cmd.run(command, function (err, data: string, stderr) {
                if (err) {
                    reject(err);
                }

                if (stderr) {
                    reject(stderr);
                }

                reslove(data);
            });
        });
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * 获取指定进程cpu 占用情况
 * @returns
 */
export const getProcessCpuInfo = async (processName: string): Promise<CpuMonitorType> => {
    const cpuUseInfo = await execCmd('wmic cpu get loadpercentage');
    let processCpuArr: any = [0, 0, 1];
    try {
        const processCpuInfo = await execCmd(
            `wmic process where name="${processName}.exe" get UserModeTime, KernelModeTime, WorkingSetSize`,
        );
        processCpuArr = Array.from(processCpuInfo.split('\n')[1].split(' ')).filter((v) => !!v);
    } catch (error) {}

    return {
        cpuUse: Number(cpuUseInfo.split('\n')[1]),
        processCpuUse: (Number(processCpuArr[0]) + Number(processCpuArr[1])) / Number(processCpuArr[2]),
    };
};

/**
 * 获取 进程内存占用情况
 * @returns
 */
export const getProcessMemoryInfo = async (serverName: string): Promise<MemoryMonitorType> => {
    const memorySumInfo: string = await execCmd('wmic ComputerSystem get TotalPhysicalMemory'); //bite
    const memorySumKb = Number(memorySumInfo.split('\n')[1]) / 1024;

    const memoryFreeInfo = await execCmd('wmic OS get FreePhysicalMemory'); // kb
    const memoryFree = Number(memoryFreeInfo.split('\n')[1]);
    let processmemoryUseUse = 0;
    try {
        const processMemoryFreeInfo = await execCmd(`wmic process where name="${serverName}.exe" get WorkingSetSize`); // bite
        processmemoryUseUse = Number(processMemoryFreeInfo.split('\n')[1]);
    } catch (error) {}

    return {
        memorySum: memorySumKb / 1024, //mb
        memoryUse: (memorySumKb - memoryFree) / 1024, // mb
        processmemoryUseUse: processmemoryUseUse / 1024 / 1024,
    };
};
