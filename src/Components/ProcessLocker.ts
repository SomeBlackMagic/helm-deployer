import * as fs from 'fs';
import { ConfigFactory } from '../Config/app-config';
import * as console from 'console';
// import { NodeJS } from 'timers';

export default class ProcessLocker {

    private driver: 'fs' | 'redis';

    public options: ProcessLockerOptions;

    private timer: NodeJS.Timeout | string | number | undefined;

    public constructor() {
        this.options = {
            maxRetries: ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_MAX_RETRIES,
            driver: ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_DRIVER,
            fsDirPath: ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_FS_DIR_PATH
        };
    }
    public async getLock(resource: string): Promise<boolean> {
        await this.initFSLocker();
        return await this.waitAvailability(resource);

    }
    public clearLock(resource: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            if (fs.existsSync(this.options.fsDirPath + '/' + resource + '.lock')) {
                fs.unlink(this.options.fsDirPath + '/' + resource + '.lock', function(err) {
                    if (err) {
                        console.error('[realise-locker] ERROR: Can not remove lock file: ' + this.options.fsDirPath + '/' + resource + '.lock');
                        resolve(true);
                    } else {
                        console.info('[realise-locker] INFO: Successfully unlock: ' + this.options.fsDirPath + '/' + resource + '.lock');
                        resolve(true);
                    }
                }.bind(this));
            } else {
                console.error('[realise-locker] DEBUG: lock file not found');
            }
        }.bind(this));
    }

    private initFSLocker():  Promise<any> {
        const res = fs.mkdirSync(this.options.fsDirPath, {recursive: true});
        return Promise.resolve();
    }

    private async waitAvailability(key:string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            console.log('[realise-locker] NOTICE: Waiting for lock on: ' + this.options.fsDirPath + '/' + key + '.lock');
            this.timer = setInterval(() => {
                (async () => {
                    const content = this.getLockData(key);
                    if (content === false) {
                        const result = await this.putLockData(key);
                        clearInterval(this.timer);
                        resolve(result);
                    }
                    const data = new Date(content.toString());
                    if (data < new Date()) {
                        console.log('[realise-locker] WARNING: Lock file exist but he is expired: ' + this.options.fsDirPath + '/' + key + '.lock');
                        const result = await this.putLockData(key);
                        clearInterval(this.timer);
                        resolve(result);
                    } else {
                        process.stdout.write('.');
                    }
                })();
            }, 1000);
        });
    }

    private getLockData(key: string):  string | false {
        if (fs.existsSync(this.options.fsDirPath + '/' + key + '.lock')) {
            return fs.readFileSync(this.options.fsDirPath + '/' + key + '.lock', 'utf8');
        }
        return false;
    }
    private putLockData(key: string): Promise<boolean> {
        const date = new Date();
        date.setSeconds(date.getSeconds() + this.options.maxRetries);
        return new Promise(function(resolve, reject) {
            fs.writeFile(this.options.fsDirPath + '/' + key + '.lock', date.toString(), 'utf8', function(err) {
                if (err) {
                    console.error('[realise-locker] ERROR: Can not create lock file: ' + JSON.stringify(err));
                    reject(false);
                } else {
                    console.info('[realise-locker] INFO: Successfully acquired lock on: ' + this.options.fsDirPath + '/' + key + '.lock');
                    resolve(true);
                }
            }.bind(this));
        }.bind(this));
    }

}
interface ProcessLockerOptions {
    maxRetries: number;
    driver: string;
    fsDirPath: string;
}
