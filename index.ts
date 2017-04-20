import * as fs from "fs";
import * as path from "path";
import execa from "execa";
import * as sudo from "sudo-prompt";

export type IOResult = Promise<{
    stdout: string;
    stderr: string;
}>;

export class NetworksetupProxy {
    constructor(private PROXY_SETTING_COMMAND = path.join(__dirname, `./rust/proxy-setting`)) {
    }
    grant(): IOResult {
        return new Promise((resolve, reject) => {
            fs.chmod(this.PROXY_SETTING_COMMAND, `4755`, (err) => {
                if (err) {
                    return reject(err);
                }

                let command = `chown 0:0 ${this.PROXY_SETTING_COMMAND}`;
                sudo.exec(command, {
                    name: 'electron sudo application'
                }, (err: string, stdout: string, stderr: string) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({stdout, stderr});
                });
            });
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
    setwebproxy(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): IOResult {
        return this.exec(`-setwebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setsecurewebproxy(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): IOResult {
        return this.exec(`-setsecurewebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setwebproxystate(networkservice: string, enabled: string): IOResult {
        return this.exec(`-setwebproxystate`, [networkservice, enabled]);
    }
    setsecurewebproxystate(networkservice: string, enabled: string): IOResult {
        return this.exec(`-setsecurewebproxystate`, [networkservice, enabled]);
    }
    private exec(command: string, params: string[]): IOResult {
        params.unshift(command);
        return execa(this.PROXY_SETTING_COMMAND, params);
    }
}
