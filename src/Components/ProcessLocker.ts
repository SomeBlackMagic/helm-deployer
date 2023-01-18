import * as fs from 'fs';
import { ConfigFactory } from '../Config/app-config';
import * as console from 'console';
// import { NodeJS } from 'timers';

export default class ProcessLocker {

    private driver: 'fs' | 'redis';

    private timer: NodeJS.Timeout | string | number | undefined;

    public constructor() {
    }
    public async getLock(resource: string): Promise<any> {
        await this.initFSLocker();
        await this.waitAvailability(resource);

    }

    public clearLock(): Promise<any> {
        return Promise.resolve();
    }

    private initFSLocker():  Promise<any> {
        console.log(ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_FS_DIR_PATH);
        const res = fs.mkdirSync(ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_FS_DIR_PATH, {recursive: true});
        return Promise.resolve();
    }

    private async waitAvailability(key:string): Promise<boolean> {
        console.log('[realise-locker] NOTICE: Waiting for lock on: ' + ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_FS_DIR_PATH + '/' + key);
        this.timer = setInterval(() => {
            (async () => {
                const data = this.getLockData(key);
                console.log(data);
            })();
        }, 1000);


    }

    private getLockData(key: string):  string | false {
        if (fs.existsSync(ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_FS_DIR_PATH + '/' + key)) {
            return fs.readFileSync(ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_FS_DIR_PATH + '/' + key, 'utf8');
        }
        return false;
    }
    private putLockData(key: string) {
        return fs.readFileSync(ConfigFactory.getCore().HELM_ASSISTANT_REALISE_LOCK_FS_DIR_PATH + '/' + key, 'utf8');
    }

}
