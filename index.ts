import * as fs from "fs";
import * as path from "path";
import * as execa from "execa";
import * as sudo from "sudo-prompt";

const promisify = require("es6-promisify");

export type IOResult = {
    stdout: string;
    stderr: string;
};

const promisedFsChmod = promisify(fs.chmod, fs);
const promisedFsStat = promisify(fs.stat, fs);
const promisedSudoExec = promisify(sudo.exec, {
    thisArg: sudo,
    multiArgs: true,
});

export class NetworksetupProxy {
    constructor(
        private sudoApplicationName: string = 'electron sudo application',
        private PROXY_SETTING_COMMAND = path.join(__dirname, `./rust/proxy-setting`),
    ) {
    }

    async grant(): Promise<IOResult> {
        await promisedFsChmod(this.PROXY_SETTING_COMMAND, `4755`);
        let [stdout, stderr]: string[] = await promisedSudoExec(
            `chown 0:0 "${this.PROXY_SETTING_COMMAND}"`,
            {
                name: this.sudoApplicationName,
            }
        );
        return {stdout, stderr};
    }

    async hasGrant(): Promise<boolean> {
        let stats = await promisedFsStat(this.PROXY_SETTING_COMMAND);
        return Number(stats.uid) === 0;
    }

    setwebproxy(
        networkservice: string,
        domain: string,
        port?: string,
        authenticated?: string,
        username?: string,
        password?: string,
    ): Promise<IOResult> {
        return this.exec(`-setwebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }

    setsecurewebproxy(
        networkservice: string,
        domain: string,
        port?: string,
        authenticated?: string,
        username?: string,
        password?: string,
    ): Promise<IOResult> {
        return this.exec(`-setsecurewebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }

    setwebproxystate(
        networkservice: string,
        enabled: string,
    ): Promise<IOResult> {
        return this.exec(`-setwebproxystate`, [networkservice, enabled]);
    }

    setsecurewebproxystate(
        networkservice: string,
        enabled: string,
    ): Promise<IOResult> {
        return this.exec(`-setsecurewebproxystate`, [networkservice, enabled]);
    }

    private exec(
        command: string,
        params: string[],
    ): Promise<IOResult> {
        params.unshift(command);
        return execa.shell(`${this.PROXY_SETTING_COMMAND} "${params.map((param) => (param || '').replace(/["\\]/g, '\\$&')).join('" "')}"`);
    }
}
