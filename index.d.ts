export declare type IOResult = Promise<{
    stdout: string;
    stderr: string;
}>;
export declare class NetworksetupProxy {
    private PROXY_SETTING_COMMAND;
    grant(): IOResult;
    hasGrant(): IOResult;
    setwebproxy(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): IOResult;
    setsecurewebproxy(networkservice: string, enabled: string): IOResult;
    setwebproxystate(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): IOResult;
    setsecurewebproxystate(networkservice: string, enabled: string): IOResult;
    private exec(command, params);
}
