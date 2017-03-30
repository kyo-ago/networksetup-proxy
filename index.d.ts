export declare type IOResult = Promise<{
    stdout: string;
    stderr: string;
}>;
export declare class NetworksetupProxy {
    private PROXY_SETTING_COMMAND;
    grant(): Promise<any>;
    hasGrant(): Promise<boolean>;
    setwebproxy(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): Promise<IOResult>;
    setsecurewebproxy(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): Promise<IOResult>;
    setwebproxystate(networkservice: string, enabled: string): Promise<IOResult>;
    setsecurewebproxystate(networkservice: string, enabled: string): Promise<IOResult>;
    private exec(command, params);
}
