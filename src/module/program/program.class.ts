export type ProgramConfigType = {
    configContent: string;
    configPath: string;
};

export type NewProgramInfo = {
    config: Array<ProgramConfigType>;
    deployPath: string;
    desc: string;
    execPath: string;
    programPkg: string;
    versionName: string;
    maxRetries: number;
    maxRestarts: number;
    grow: number;
    wait: number;
};

export type LogsReaderConf = {
    logsPath: string;
    startTime: string;
    endTime: string;
    pageSize: number;
    pageNumber: number;
};

export type UpdateRunningConf = {
    name: string;
    deployPath: string;
    config: Array<ProgramConfigType>;
};

export type UpdateProgramInfo = {
    desc: string;
    programPkg: string;
    versionName: string;
    name: string;
};
