import { spawn } from 'child_process';

import { parseScutilOutput } from './parse-scutil';

export function getMacSystemProxy() {
    return new Promise((resolve, reject) => {
        const scutilProc = spawn('scutil', ['--proxy'], { stdio: 'pipe' });
        scutilProc.on('error', reject);

        const stdoutData: Buffer[] = [];
        scutilProc.stdout.on('data', (d) => stdoutData.push(d));

        scutilProc.on('exit', (code, signal) => {
            if (code !== 0) reject(new Error(`Scutil exited with ${code || signal}`));
            const output = Buffer.concat(stdoutData).toString('utf8');
            resolve(parseScutilOutput(output));
        });
    });
}