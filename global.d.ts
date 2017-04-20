declare module "sudo-prompt" {
    export function exec(...args: any[]): Promise<any>;
}

declare module "execa" {
    export default function execa(...args: any[]): any;
}
