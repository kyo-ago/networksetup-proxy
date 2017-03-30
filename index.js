"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const child_process_1 = require("child_process");
const electron_sudo_1 = require("electron-sudo");
class NetworksetupProxy {
    constructor() {
        this.PROXY_SETTING_COMMAND = `./rust/proxy-setting`;
    }
    grant() {
        return new Promise((resolve, reject) => {
            fs.chmod(this.PROXY_SETTING_COMMAND, `4755`, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        }).then(() => {
            const sudoer = new electron_sudo_1.default({ name: 'electron sudo application' });
            return sudoer.exec(`chown 0:0 ${this.PROXY_SETTING_COMMAND}`);
        });
    }
    hasGrant() {
        return new Promise((resolve, reject) => {
            fs.stat(this.PROXY_SETTING_COMMAND, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                resolve(Number(stats.uid) === 0);
            });
        });
    }
    setwebproxy(networkservice, domain, port, authenticated, username, password) {
        return this.exec(`-setwebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setsecurewebproxy(networkservice, domain, port, authenticated, username, password) {
        return this.exec(`-setsecurewebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setwebproxystate(networkservice, enabled) {
        return this.exec(`-setwebproxystate`, [networkservice, enabled]);
    }
    setsecurewebproxystate(networkservice, enabled) {
        return this.exec(`-setsecurewebproxystate`, [networkservice, enabled]);
    }
    exec(command, params) {
        return new Promise((resolve, reject) => {
            child_process_1.exec(`${command} ${params.join(' ')}`, (error, stdout, stderr) => {
                if (error && !stderr) {
                    return reject(error);
                }
                resolve({ stdout, stderr });
            });
        });
    }
}
exports.NetworksetupProxy = NetworksetupProxy;
