/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEventEmission } from './interfaces';
import { NoelEventMiddleware } from './types';
import { NoelEventEmissionWasAborted } from './errors';

export class NoelEventEmissionImp implements NoelEventEmission {
    private emissionPromise: Promise<void>;
    private promiseResolve: Function;
    private promiseReject: Function;
    private wasAborted: boolean;

    constructor(private eventName: string, private eventArgs: Array<any>, private remainingMiddlewares: Array<NoelEventMiddleware>) {}

    digestMiddlewares(): void {
        const nextMiddleware = this.remainingMiddlewares.pop();
        if (nextMiddleware) {
            nextMiddleware(this);
        } else if (this.promiseResolve) {
            this.promiseResolve();
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

    then(): Promise<void> {
        if (this.emissionPromise) return this.emissionPromise;
        return (this.emissionPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        }));
    }
}
