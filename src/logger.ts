/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelLogger } from './interfaces';

export class NoelLoggerImp implements NoelLogger {
    private console: any;

    constructor() {
        if (console) {
            this.console = console;
        }
    }

    warn(warn: string) {
        if (this.console) {
            const logFn = this.console.warn || this.console.log;
            logFn(warn);
        }
    }
}
