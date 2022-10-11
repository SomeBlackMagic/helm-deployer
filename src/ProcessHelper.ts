export class ProcessHelper {
    public exitHandler: Function;


    public subscribeOnProcessExit(): void {


        /*do something when app is closing*/
        // process.on('exit', this.exitHandler.bind(null, {cleanup: true, code:'exit'}));

        /*catches ctrl+c event*/
        process.on('close', this.exitHandler.bind(null, {exit: true, code: 'exit'}));
        process.on('SIGINT', this.exitHandler.bind(null, {exit: true, code: 'SIGINT'}));
        process.on('SIGQUIT', this.exitHandler.bind(null, {exit: true, code: 'SIGQUIT'}));

        /*catches "kill pid" (for example: nodemon restart)*/
        process.on('SIGUSR1', this.exitHandler.bind(null, {exit: true, code: 'SIGUSR1'}));
        process.on('SIGUSR2', this.exitHandler.bind(null, {exit: true, code: 'SIGUSR2'}));
        process.on('SIGTERM', this.exitHandler.bind(null, {exit: true, code: 'SIGTERM'}));

        /*catches uncaught exceptions*/
        process.on('uncaughtException', this.uncaughtExceptionHandler);
        process.on('unhandledRejection', this.uncaughtRejectionHandler);
    }

    public setExitHandler(cb: Function): void {
        this.exitHandler = cb;
    }


    public uncaughtExceptionHandler(error: Error) {
        //console.error(error.message, error.stack, error.name);
        process.emit('SIGTERM');
        // process.exit(99);
        // throw error;

    }

    public uncaughtRejectionHandler(reason: {} | null | undefined, promise: Promise<any>) {
        if (typeof reason !== 'undefined') {
            console.error(reason['message']);
            console.error(reason['stack']);
        }
        process.emit('SIGTERM');

    }

}
