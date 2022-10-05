import {env, envBoolean, processSignalDebug} from './Helpers';
import {spawn} from 'child_process';
import {UpgradeModule} from './Modules/UpgradeModule';
import {ProcessHelper} from './ProcessHelper';
import {ConfigFactory} from './Config/app-config';
import {HelmProxyModule} from './Modules/HelmProxyModule';

processSignalDebug('general', process);
const processHelper = new ProcessHelper();
const upgradeModule = new UpgradeModule();
const helmProxy = new HelmProxyModule();


processHelper.setExitHandler((data: { code: string }) => {
    console.log('PCNTL signal received. Graceful stop all modules.', [data.code]);
    (async () => {
        await Promise.all([
            upgradeModule,
            helmProxy
        ].map((item: any) => {
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

    // if(HELM_CMD === 'false') {
    //     throw Error('Variable HELM is not set')
    // }
    // if(KUBECTL_CMD === 'false') {
    //     throw Error('Variable KUBECTL is not set')
    // }

    const processArgs = process.argv.slice(2);
    processArgs.forEach((item: string) => {
        if (item === 'upgrade' || item === 'list') {
            upgradeModule.run(processArgs);
        }
    });


    await helmProxy.runHelmCMD(ConfigFactory.getCore().HELM_BIN_PATH, [
        ...HELM_CMD_ARGS.split(' '),
        ...processArgs
    ]);
    processHelper.exitHandler({code: 'exit'});

})();


