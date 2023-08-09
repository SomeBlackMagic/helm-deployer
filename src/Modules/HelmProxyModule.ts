import {ChildProcess, spawn} from 'child_process';
import {clearTimeout} from 'timers';
import Logger from '../Components/Logger';
import {SubProcessTracer} from '../Components/SubProcessTracer';

export class HelmProxyModule {
    private process: ChildProcess | null = null;

    public async runHelmCMD(cmd: string, cliArgs: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.process = spawn(cmd, cliArgs.filter((item) => { return item !== ''; }), {
                // killSignal: 'SIGTERM',
                // timeout: 30000,
                // detached: true,
                // stdio: [null, 'pipe', 'pipe']
            });
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

            SubProcessTracer.getInstance().watch(this.process);

            this.process.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
                if (code === 0 || signal === 'SIGTERM') {
                    resolve();
                    this.process = null;
                } else {
                    this.process = null;
                    process.exitCode = code;
                    Logger.error('HelmProxyModule', 'helm process failed', {code, signal});
                    resolve();
                }
            });
        });
    }

    public async stop(): Promise<boolean> {
        if (this.process === null) {
            return Promise.resolve(true);
        }
        return new Promise((resolve, reject) => {
            this.process.kill('SIGTERM');

            const  timer = setTimeout(() => {
                console.log('Timeout waiting stop helm. Killing');
                this.process.kill('SIGKILL');
                // clearInterval(interval);
            }, 10000);
            // this.process.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
            //     console.log('close');
            // });
            this.process.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
                Logger.trace('HelmProxyModule', 'helm process finished', {code, signal});
                clearTimeout(timer);
                this.process = null;
                resolve(true);
            });
        });
    }
}
