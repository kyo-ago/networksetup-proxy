import * as fs from "fs";
import {exec} from "child_process";
import Sudoer from "electron-sudo";

export type IOResult = Promise<{
    stdout: string;
    stderr: string;
}>;

export class NetworksetupProxy {
    private PROXY_SETTING_COMMAND = `./rust/proxy-setting`;
    grant(): IOResult {
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
    hasGrant(): IOResult {
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
    setsecurewebproxy(networkservice: string, enabled: string): IOResult {
        return this.exec(`-setwebproxy`, [networkservice, enabled]);
    }
    setwebproxystate(networkservice: string, domain: string, port?: string, authenticated?: string, username?: string, password?: string): IOResult {
        return this.exec(`-setwebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setsecurewebproxystate(networkservice: string, enabled: string): IOResult {
        return this.exec(`-setwebproxy`, [networkservice, enabled]);
    }
    private exec(command: string, params: string[]): IOResult {
        return new Promise((resolve, reject) => {
            exec(`${command} ${params.join(' ')}`, (error, stdout, stderr) => {
                if (error && !stderr) {
                    return reject(error);
                }
                resolve({stdout, stderr});
            });
        });
    }
}
