export interface Conf {
    port?: number;
    scpParams?: string[];
    sshParams?: string[];
    host: string;
    remoteFolder: string;
    startCmd?: string;
    watchDir?: string;
}
export declare class ScpSync {
    private conf;
    constructor(conf: Conf);
    static resolveConf(): ScpSync;
    resolveFile(file: string): string;
    scp(file: string): Promise<void>;
    watch(): void;
    startCmd(): Promise<import("execa").ExecaReturnValue<string> | undefined>;
    ssh(cmd: string): import("execa").ExecaChildProcess<string>;
}
