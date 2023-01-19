import {ConfigFactory} from '../Config/app-config';

const cliColor = require('cli-color');

export class VersionModule {
    public async run(cliArgs: any): Promise<any> {
        console.log(ConfigFactory.getBase().id + ': ' + ConfigFactory.getBase().version);
        return Promise.resolve();

    }

}
