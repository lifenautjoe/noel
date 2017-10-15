/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEvent, NoelEventConfig, NoelEventListenerManager, NoelEventMiddlewareManager } from './interfaces';
import { NoelEventListener, NoelEventMiddleware } from './types';
import { NoelEventMiddlewareManagerImp } from './event-middleware-manager';
import { NoelEventListenerManagerImp } from './event-listener-manager';
import { NoelEventEmissionImp } from './event-emission';
import { NoelEventConfigError, NoelEventReplayNotEnabled } from './errors';

export class NoelEventImp implements NoelEvent {
    private name: string;
    private replayEnabled: boolean;
    private replayBufferSize: number;
    private replayBuffer: Array<any> | null = null;
    private listeners: Set<NoelEventListener> | null = null;
    private middlewares: Set<NoelEventMiddleware> | null = null;

    constructor(config: NoelEventConfig) {
        config = config || {};

        if (!config.name) throw new NoelEventConfigError('config.name:string is required');

        this.replayBufferSize = config.replayBufferSize || 1;

        const replayEnabled = config.replay || false;
        replayEnabled ? this.enableReplay() : this.disableReplay();
    }

    replayIsEnabled(): boolean {
        return this.replayEnabled;
    }

    enableReplay(): void {
        if (this.replayEnabled) return;
        this.replayEnabled = true;
        this.replayBuffer = [];
    }

    disableReplay(): void {
        this.replayEnabled = false;
        this.replayBuffer = null;
    }

    emit(...eventArgs: Array<any>): void {
        const listeners = this.listeners;
        if (!listeners) return;

        const middlewares = this.middlewares;
        middlewares ? this.emitWithMiddlewares(listeners, middlewares, eventArgs) : this.emitNormally(listeners, eventArgs);
    }

    on(listener: NoelEventListener): NoelEventListenerManager {
        const listeners = this.getListeners();
        listeners.add(listener);
        return new NoelEventListenerManagerImp(listener, this);
    }

    removeListener(listener: NoelEventListener): void {
        const listeners = this.listeners;
        if (!listeners) return;
        listeners.delete(listener);
    }

    countListeners(): number {
        return this.listeners ? this.listeners.size : 0;
    }

    useMiddleware(middleware: NoelEventMiddleware): NoelEventMiddlewareManager {
        const middlewares = this.getMiddlewares();
        middlewares.add(middleware);
        return new NoelEventMiddlewareManagerImp(middleware, this);
    }

    removeMiddleware(middleware: NoelEventMiddleware): void {
        const middlewares = this.getMiddlewares();
        middlewares.delete(middleware);
    }

    clearMiddlewares() {
        this.middlewares = null;
    }

    clearReplayBuffer(): void {
        this.replayBuffer = null;
    }

    clearListeners() {
        this.listeners = null;
    }

    setReplayBufferSize(replayBufferSize: number): void {
        if (!this.replayEnabled) throw new NoelEventReplayNotEnabled(this.name);
        const replayBuffer = this.replayBuffer;
        if (!replayBuffer) return;
        this.replayBuffer = replayBuffer.slice(0, replayBufferSize);
    }

    getReplayBufferAmount(replayBufferAmount: number): Array<any> {
        if (!this.replayEnabled) throw new NoelEventReplayNotEnabled(this.name);
        const replayBuffer = this.getReplayBuffer();
        return typeof replayBufferAmount === 'undefined' || replayBufferAmount === replayBuffer.length ? replayBuffer : replayBuffer.slice(0, replayBufferAmount);
    }

    private emitWithMiddlewares(listeners: Set<NoelEventListener>, middlewares: Set<NoelEventMiddleware>, eventArgs: Array<any>): void {
        const emission = new NoelEventEmissionImp(this.name, eventArgs, middlewares);
        emission.then((finalEventArgs: Array<any>) => {
            this.emitNormally(listeners, finalEventArgs);
        });
        emission.digestMiddlewares();
    }

    private emitNormally(listeners: Set<NoelEventListener>, eventArgs: Array<any>) {
        listeners.forEach(listener => listener(...eventArgs));
        if (this.replayEnabled) this.pushEventArgsToReplayBuffer(eventArgs);
    }

    private getListeners(): Set<NoelEventListener> {
        return this.listeners || (this.listeners = new Set<NoelEventListener>());
    }

    private pushEventArgsToReplayBuffer(eventArgs: Array<any>) {
        const replayBuffer = this.getReplayBuffer();
        replayBuffer.push(eventArgs);
        if (replayBuffer.length > this.replayBufferSize) replayBuffer.shift();
    }

    private getReplayBuffer(): Array<any> {
        return this.replayBuffer || (this.replayBuffer = []);
    }

    private getMiddlewares(): Set<NoelEventMiddleware> {
        return this.middlewares || (this.middlewares = new Set<NoelEventMiddleware>());
    }
}
