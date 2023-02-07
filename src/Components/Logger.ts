export default class Logger {
    private static instance: Logger;
    private readonly category: string;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor(category: string) {
        this.category = category;
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(category: string = ''): Logger {
        return new Logger(category);
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public static  trace(category: string, text: string, someData: object = {}) {
        Logger.getInstance(category).trace(text, someData);
    }
    public static info(category: string, text: string, someData: object = {}) {
        Logger.getInstance(category).info(text, someData);
    }

    public static debug(category: string, text: string, someData: object = {}) {
        Logger.getInstance(category).debug(text, someData);
    }
    public static warn(category: string, text: string, someData: object = {}) {
        Logger.getInstance(category).warn(text, someData);
    }
    public static error(category: string, text: string, someData: object = {}) {
        Logger.getInstance(category).error(text, someData);
    }

    public static fatal(category: string, text: string, someData: object = {}) {
        Logger.getInstance(category).fatal(text, someData);
    }


    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public trace(text: string, someData: object = {}) {
        this.log('trace', text, someData);
    }

    public info(text: string, someData: object = {}) {
        this.log('info', text, someData);
    }

    public debug(text: string, someData: object) {
        this.log('debug', text, someData);
    }
    public warn(text: string, someData: object) {
        this.log('warn', text, someData);
    }
    public error(text: string, someData: object) {
        this.log('error', text, someData);
    }

    public fatal(text: string, someData: object) {
        this.log('fatal', text, someData);
    }

    private log(level:string, text: string, someData: object) {
        const logDebugger  = require('debug');
        logDebugger.color = 'w';
        const log2 = logDebugger(this.category + ':' + level);
        if (Object.entries(someData).length !== 0) {
            log2(text + ' ' + JSON.stringify(someData));
        } else {
            log2(text);
        }
    }
}
