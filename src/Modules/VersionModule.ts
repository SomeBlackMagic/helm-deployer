import {ConfigFactory} from '../Config/app-config';
import Logger from '../Components/Logger';

const cliColor = require('cli-color');

export class VersionModule {
    public async run(cliArgs: any): Promise<any> {
        Logger.info('VersionModule', 'Installed version:', [ConfigFactory.getBase().version]);
        return Promise.resolve();

    }

}
