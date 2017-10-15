/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEventEmission } from './interfaces';
import { NoelEventMiddleware, NoelEventMiddlewareNextExecutor } from './types';
import { NoelEventEmissionWasAborted } from './errors';

export class NoelEventEmissionImp implements NoelEventEmission {
    private emissionPromise: Promise<void>;
    private promiseResolve: Function;
    private promiseReject: Function;
    private wasAborted: boolean;
    private middlewaresIterator: IterableIterator<NoelEventMiddleware>;

    constructor(private eventName: string, private eventArgs: Array<any>, private middlewares: Set<NoelEventMiddleware>) {
        this.middlewaresIterator = middlewares.values();
        this.emissionPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
    }

    digestMiddlewares(): void {
        const next = this.middlewaresIterator.next();
        if (next.done) {
            if (this.promiseResolve) this.promiseResolve(this.eventArgs);
        } else {
            next.value(this);
        }
    }

    next(...newEventArgs: Array<any>): void {
        if (this.wasAborted) throw new NoelEventEmissionWasAborted(this.eventName);
        if (newEventArgs) this.eventArgs = newEventArgs;
        this.digestMiddlewares();
    }

    getEventArgs(): Array<any> {
        return this.eventArgs;
    }

    getEventName(): string {
        return this.eventName;
    }

    abort(reason: Error): void {
        this.wasAborted = true;
        if (this.promiseReject) this.promiseReject(reason);
    }

    then(executor: NoelEventMiddlewareNextExecutor): Promise<Array<any> | void> {
        return this.emissionPromise.then(executor);
    }
}
