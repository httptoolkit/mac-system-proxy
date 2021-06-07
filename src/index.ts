import { spawn } from 'child_process';

import { parseScutilOutput } from './parse-scutil';

export interface MacProxySettings {
    ExceptionsList?: string[];
    ExcludeSimpleHostnames?: "1" | "0",
    FTPPassive?: "1" | "0",

    HTTPEnable?: "1" | "0",
    HTTPPort?: string;
    HTTPProxy?: string;
    HTTPUser?: string;

    HTTPSEnable?: "1" | "0",
    HTTPSProxy?: string;
    HTTPSPort?: string;
    HTTPSUser?: string;

    SOCKSEnable?: "1" | "0",
    SOCKSProxy?: string;
    SOCKSPort?: string;
    SOCKSUser?: string;

    ProxyAutoConfigEnable?: "1" | "0",
    ProxyAutoDiscoveryEnable?: "1" | "0",
    ProxyAutoConfigURLString?: string;
}

export function getMacSystemProxy(): Promise<MacProxySettings> {
    return new Promise((resolve, reject) => {
        const scutilProc = spawn('scutil', ['--proxy'], { stdio: 'pipe' });
        scutilProc.on('error', reject);

        const stdoutData: Buffer[] = [];
        scutilProc.stdout.on('data', (d) => stdoutData.push(d));

        scutilProc.on('exit', (code, signal) => {
            if (code !== 0) reject(new Error(`Scutil exited with ${code || signal}`));
            const output = Buffer.concat(stdoutData).toString('utf8');

            try {
                resolve(parseScutilOutput(output));
            } catch (e) {
                reject(e);
            }

        });
    });
}