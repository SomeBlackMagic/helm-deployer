import {ChildProcessWithoutNullStreams, spawn} from 'child_process';
import {inArray, processSignalDebug} from '../Helpers';
import {ConfigFactory} from '../Config/app-config';
import {clearTimeout} from 'timers';

const cliColor = require('cli-color');

export class VersionModule {
    public async run(cliArgs: string[]) {
        console.log(ConfigFactory.getBase().id + ': ' + ConfigFactory.getBase().version);
        return Promise.resolve();

    }

}
