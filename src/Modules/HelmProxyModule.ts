import {ChildProcessWithoutNullStreams, spawn} from 'child_process';
import {processSignalDebug} from '../Helpers';

export class HelmProxyModule {
    private process: ChildProcessWithoutNullStreams;

    public async runHelmCMD(cmd: string, cliArgs: string[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.process = spawn(cmd, cliArgs);

            this.process.stdout.on('data', (arrayBuffer) => {
                const data = Buffer.from(arrayBuffer, 'utf-8').toString().split('\n');
                data.forEach((item, index) => {
                    if (item !== '') {
                        console.log(item);
                    }
                });
            });
            this.process.stderr.on('data', (arrayBuffer) => {
                const data = Buffer.from(arrayBuffer, 'utf-8').toString().split('\n');
                data.forEach((item, index) => {
                    if (item !== '') {
                        console.error(item);
                    }
                });

            });

            processSignalDebug('helm:->', this.process);

            this.process.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
                if (code === 0) {
                    resolve();
                    this.process = null;
                } else {
                    reject(new Error('Helm command failed. Exit code:' + code));
                }
            });
        });
    }

    public async stop(): Promise<any> {
        if (this.process === null) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.process.kill('SIGKILL');
            }, 10000);
            this.process.kill('SIGINT');
            this.process.on('exit', (code: number) => {
                resolve();
            });
        });
    }
}
