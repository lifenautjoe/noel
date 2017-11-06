/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

const consolePoly = {
    warn: () => {}
};

export class NoelLogger {
    private console?: any;

    constructor() {
        this.console = typeof console === 'undefined' ? consolePoly : console;
    }

    warn(warn: string) {
        this.console.warn(warn);
    }
}
