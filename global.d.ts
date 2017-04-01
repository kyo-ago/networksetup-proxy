declare module "electron-sudo" {
    export default class Sudoer {
        constructor(...args: any[]);
        spawn(...args: any[]): Promise<any>;
        exec(...args: any[]): Promise<any>;
    }
}

declare module "execa" {
    export default function execa(...args: any[]): any;
}
