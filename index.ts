import * as fs from "fs";
import execa from "execa";
import Sudoer from "electron-sudo";

export type IOResult = Promise<{
    stdout: string;
    stderr: string;
}>;

export class NetworksetupProxy {
    private PROXY_SETTING_COMMAND = `./rust/proxy-setting`;
    grant(): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.chmod(this.PROXY_SETTING_COMMAND, `4755`, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        }).then(() => {
            const sudoer = new Sudoer({name: 'electron sudo application'});
            return sudoer.exec(`chown 0:0 ${this.PROXY_SETTING_COMMAND}`);
        });
    }
    hasGrant(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.stat(this.PROXY_SETTING_COMMAND, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                resolve(Number(stats.uid) === 0);
            });
        });
    }
    setwebproxy(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): Promise<IOResult> {
        return this.exec(`-setwebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setsecurewebproxy(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): Promise<IOResult> {
        return this.exec(`-setsecurewebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setwebproxystate(networkservice: string, enabled: string): Promise<IOResult> {
        return this.exec(`-setwebproxystate`, [networkservice, enabled]);
    }
    setsecurewebproxystate(networkservice: string, enabled: string): Promise<IOResult> {
        return this.exec(`-setsecurewebproxystate`, [networkservice, enabled]);
    }
    private exec(command: string, params: string[]): Promise<IOResult> {
        params.unshift(command);
        return execa(this.PROXY_SETTING_COMMAND, params);
    }
}
