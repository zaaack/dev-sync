export interface Conf {
    port?: number;
    scpParams?: string[];
    sshParams?: string[];
    host: string;
    remoteFolder: string;
    startCmd?: string;
    localFolder?: string;
    ignore: string[];
}
export declare class ScpSync {
    private conf;
    constructor(conf: Conf);
    static resolveConf(): ScpSync;
    resolveFile(file: string): string;
    scp(file: string): Promise<void | import("execa").ExecaReturnValue<string>>;
    private _runningScpTask;
    watch(): void;
    startCmd(): Promise<void | import("execa").ExecaReturnValue<string>>;
    ssh(cmd: string): Promise<void | import("execa").ExecaReturnValue<string>>;
}
