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
