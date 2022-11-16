import { loadEnvVariablesFromFile, processSignalDebug } from './Helpers';
import {UpgradeModule} from './Modules/UpgradeModule';
import {ProcessHelper} from './ProcessHelper';
import {ConfigFactory} from './Config/app-config';
import {HelmProxyModule} from './Modules/HelmProxyModule';
import {VersionModule} from './Modules/VersionModule';

loadEnvVariablesFromFile();

const processHelper = new ProcessHelper();
const upgradeModule = new UpgradeModule();
const helmProxyModule = new HelmProxyModule();
const versionModule = new VersionModule();


processHelper.setExitHandler((data: { code: string }) => {
    (async () => {
        console.log('PCNTL signal received. Graceful stop all modules.', [data.code]);
        await Promise.all([upgradeModule, helmProxyModule].map((item: any) => {
            return item.stop();
        })).catch((error) => {
            console.log('Can not stop services', error);
            process.exitCode = 1;
        });
        console.log('System gracefully stopped');
        // @ts-ignore
        // await process.flushLogs();
    })();
});
processHelper.subscribeOnProcessExit();

(async () => {

    let HELM_CMD_ARGS = ConfigFactory.getCore().HELM_CMD_ARGS;
    if (ConfigFactory.getCore().HELM_DEBUG === true) {
        HELM_CMD_ARGS += ' --debug';
    }
    if (ConfigFactory.getCore().HELM_DRY_RUN === true) {
        HELM_CMD_ARGS += ' --dry-run';
    }

    const processArgs = process.argv.slice(2);
    processArgs.forEach((item: string) => {
        switch (item) {
            case 'upgrade':
                upgradeModule.run(processArgs);
                break;
            case 'version':
                versionModule.run(processArgs);
                break;
        }
    });


    await helmProxyModule.runHelmCMD(ConfigFactory.getCore().HELM_BIN_PATH, [
        ...HELM_CMD_ARGS.split(' '),
        ...processArgs
    ])
    processHelper.exitHandler({code: 'exit'});

})();


