/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelLogger } from './interfaces';

const consolePoly = {
    warn: () => {}
};

export class NoelLoggerImp implements NoelLogger {
    private console: any;

    constructor() {
        this.console = typeof console === 'undefined' ? consolePoly : console;
    }

    warn(warn: string) {
        this.console.warn(warn);
    }
}
