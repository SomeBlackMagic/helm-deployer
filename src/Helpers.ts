'use strict';
import {config, DotenvParseOutput} from 'dotenv';
import * as fs from 'fs';
import {ChildProcessWithoutNullStreams} from 'child_process';
import * as Process from 'process';
import {ConfigFactory} from './Config/app-config';

export function inArray(arr: string[] | number[] = [], val:string|number): boolean {
    let len = arr.length;
    let i;

    for (i = 0; i < len; i++) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
}

export function env(key: string, defaultValue: any = null): string {
    return process.env[key] ? process.env[key] :  defaultValue;
}

/**
 *
 * @param key
 * @param defaultValue
 * @param radix
 */
export function envNumber(key: string, defaultValue: number = null, radix: number): number {
    return process.env[key] ? parseInt(process.env[key], radix) :  defaultValue;
}


/**
 *
 * @param key
 * @param defaultValue
 */
export function envBoolean(key: string, defaultValue: boolean): boolean {
    let value = process.env[key] ? process.env[key] : defaultValue;
    // @ts-ignore
    switch (value) {
        case true:
        case 'true':
        case 'True':
        case '1':
        case 'on':
        case 'yes':
            return true;
        default:
            return false;
    }
}

export function processSignalDebug(name: string, stream: ChildProcessWithoutNullStreams | NodeJS.Process) {
    if (ConfigFactory.getCore().HELM_ASSISTANT_DEBUG === true) {
        if ('spawnargs' in stream) {
            console.log(name + ' ' + stream.spawnargs.join(' '));
        } else {
            console.log(name + ' ' + stream.argv.join(' '));
        }
    }

    return;
    stream.on('beforeExit', () => {console.log(stream.pid + ' send => beforeExit'); });
    stream.on('disconnect', () => {console.log(stream.pid + ' send => disconnect'); });
    stream.on('rejectionHandled', () => {console.log(stream.pid + ' send => rejectionHandled'); });
    stream.on('uncaughtException', () => {console.log(stream.pid + ' send => uncaughtException'); });
    stream.on('unhandledRejection', () => {console.log(stream.pid + ' send => unhandledRejection'); });
    stream.on('warning', (warning: Error) => {console.log(stream.pid + ' send => warning' , warning); });
    stream.on('message', () => {console.log(stream.pid + ' send => message'); });
    stream.on('removeListener', (type: string) => {console.log(stream.pid + ' send => removeListener' , type); });
    stream.on('multipleResolves', () => {console.log(stream.pid + ' send => multipleResolves '); });
    stream.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
        if (code !== 0 ) {
            console.error(stream.pid + ' send => exit:' + code + ' by signal ' + signal);
        } else {
            console.info(stream.pid + ' send => exit:' + code + ' by signal ' + signal);
        }
    });

    // stream.on('SIGABRT', (...args: any[]) => {console.log(stream.pid + ' send => SIGABRT. args:' + args); });
    // stream.on('SIGALRM', (...args: any[]) => {console.log(stream.pid + ' send => SIGALRM. args:' + args); });
    // stream.on('SIGBUS', (...args: any[]) => {console.log(stream.pid + ' send => SIGBUS. args:' + args); });
    // stream.on('SIGCHLD', (...args: any[]) => {console.log(stream.pid + ' send => SIGCHLD. args:' + args); });
    // stream.on('SIGCONT', (...args: any[]) => {console.log(stream.pid + ' send => SIGCONT. args:' + args); });
    // stream.on('SIGFPE', (...args: any[]) => {console.log(stream.pid + ' send => SIGFPE. args:' + args); });
    stream.on('SIGHUP', (...args: any[]) => {console.log(stream.pid + ' send => SIGHUP. args:' + args); });
    // stream.on('SIGILL', (...args: any[]) => {console.log(stream.pid + ' send => SIGILL. args:' + args); });
    stream.on('SIGINT', (...args: any[]) => {console.log(stream.pid + ' send => SIGINT. args:' + args); });
    // stream.on('SIGIO', (...args: any[]) => {console.log(stream.pid + ' send => SIGIO. args:' + args); });
    // stream.on('SIGIOT', (...args: any[]) => {console.log(stream.pid + ' send => SIGIOT. args:' + args); });
    // stream.on('SIGPIPE', (...args: any[]) => {console.log(stream.pid + ' send => SIGPIPE. args:' + args); });
    // stream.on('SIGPOLL', (...args: any[]) => {console.log(stream.pid + ' send => SIGPOLL. args:' + args); });
    // stream.on('SIGPROF', (...args: any[]) => {console.log(stream.pid + ' send => SIGPROF. args:' + args); });
    // stream.on('SIGPWR', (...args: any[]) => {console.log(stream.pid + ' send => SIGPWR. args:' + args); });
    stream.on('SIGQUIT', (...args: any[]) => {console.log(stream.pid + ' send => SIGQUIT. args:' + args); });
    // stream.on('SIGSEGV', (...args: any[]) => {console.log(stream.pid + ' send => SIGSEGV. args:' + args); });
    // stream.on('SIGSTKFLT', (...args: any[]) => {console.log(stream.pid + ' send => SIGSTKFLT. args:' + args); });
    // stream.on('SIGSYS', (...args: any[]) => {console.log(stream.pid + ' send => SIGSYS. args:' + args); });
    stream.on('SIGTERM', (...args: any[]) => {console.log(stream.pid + ' send => SIGTERM. args:' + args); });
    // stream.on('SIGTRAP', (...args: any[]) => {console.log(stream.pid + ' send => SIGTRAP. args:' + args); });
    // stream.on('SIGTSTP', (...args: any[]) => {console.log(stream.pid + ' send => SIGTSTP. args:' + args); });
    // stream.on('SIGTTIN', (...args: any[]) => {console.log(stream.pid + ' send => SIGTTIN. args:' + args); });
    // stream.on('SIGTTOU', (...args: any[]) => {console.log(stream.pid + ' send => SIGTTOU. args:' + args); });
    // stream.on('SIGUNUSED', (...args: any[]) => {console.log(stream.pid + ' send => SIGUNUSED. args:' + args); });
    // stream.on('SIGURG', (...args: any[]) => {console.log(stream.pid + ' send => SIGURG. args:' + args); });
    // stream.on('SIGUSR1', (...args: any[]) => {console.log(stream.pid + ' send => SIGUSR1. args:' + args); });
    // stream.on('SIGUSR2', (...args: any[]) => {console.log(stream.pid + ' send => SIGUSR2. args:' + args); });
    // stream.on('SIGVTALRM', (...args: any[]) => {console.log(stream.pid + ' send => SIGVTALRM. args:' + args); });
    // stream.on('SIGWINCH', (...args: any[]) => {console.log(stream.pid + ' send => SIGWINCH. args:' + args); });
    // stream.on('SIGXCPU', (...args: any[]) => {console.log(stream.pid + ' send => SIGXCPU. args:' + args); });
    // stream.on('SIGXFSZ', (...args: any[]) => {console.log(stream.pid + ' send => SIGXFSZ. args:' + args); });
    // stream.on('SIGBREAK', (...args: any[]) => {console.log(stream.pid + ' send => SIGBREAK. args:' + args); });
    // stream.on('SIGLOST', (...args: any[]) => {console.log(stream.pid + ' send => SIGLOST. args:' + args); });
    // stream.on('SIGINFO', (...args: any[]) => {console.log(stream.pid + ' send => SIGINFO. args:' + args); });
    //
    // stream.stdout.on('close', () => { console.log(stream.pid + ' send => close'); });
    // stream.stdout.on('data', (chunk: any) => { console.log(stream.pid + ' send => data ' + chunk); });
    // stream.stdout.on('end', () => { console.log(stream.pid + ' send => end'); });
    // stream.stdout.on('error', (err: Error) => { console.log(stream.pid + ' send => error. ' + err); });
    // stream.stdout.on('pause', () => { console.log(stream.pid + ' send => pause'); });
    // stream.stdout.on('readable', () => { console.log(stream.pid + ' send => readable'); });
    // stream.stdout.on('resume', () => { console.log(stream.pid + ' send => resume'); });
}

export function loadEnvVariablesFromFile(): void {
    let currentEnv = env('APP_ENV');
        if (fs.existsSync(process.cwd() + '/.env.local')) {
        const env = loadEnvFile(process.cwd() + '/.env.local');
        if (env === false) {
            process.exit(1);
        }
    }
    if (currentEnv !== null && currentEnv !== 'local') {
        if (fs.existsSync(process.cwd() + '/.env.' + currentEnv)) {
            const env = loadEnvFile(process.cwd() + '/.env.' + currentEnv);
            if (env === false) {
                process.exit(1);
            }
        }
    }
}

function loadEnvFile(path: string): boolean | DotenvParseOutput {
    try {
        fs.accessSync(path, fs.constants.R_OK);
        console.log('Load env vars from file: ' + path);
        const dotEnv = config({path: path, override: true, debug: process.env.DEBUG === '*'});

        if (dotEnv.error !== undefined) {
            console.warn('Can not parse .env file in ');
            console.warn(dotEnv.error);
            return false;
        }
        return dotEnv.parsed;
    } catch (err) {
        console.warn(err);
        return false;
    }

}
