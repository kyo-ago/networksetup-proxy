const fs = require('fs');
const exec = require('child_process').exec;
const Sudoer = require('electron-sudo').default;

module.exports = class NetworksetupProxy {
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
            const sudoer = new Sudoer({name: 'electron sudo application'});
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
        this._exec(`-setwebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setsecurewebproxy(networkservice, enabled) {
        this._exec(`-setwebproxy`, [networkservice, enabled]);
    }
    setwebproxystate(networkservice, domain, port, authenticated, username, password) {
        this._exec(`-setwebproxy`, [networkservice, domain, port, authenticated, username, password]);
    }
    setsecurewebproxystate(networkservice, enabled) {
        this._exec(`-setwebproxy`, [networkservice, enabled]);
    }
    _exec(command, params) {
        return new Promise((resolve, reject) => {
            exec(`${command} ${params.join(' ')}`, (error, stdout, stderr) => {
                if (error && !stderr) {
                    return reject(error);
                }
                resolve({stdout, stderr});
            });
        });
    }
};
