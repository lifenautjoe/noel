/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEvent, NoelEventConfig, NoelEventListenerManager, NoelLogger } from './interfaces';
import { NoelEventListener } from './types';
import { NoelEventListenerManagerImp } from './event-listener-manager';
import { NoelBuffeSizeNotValidError, NoelEventConfigError, NoelEventListenerError, NoelEventReplayNotEnabled } from './errors';
import NoelImp from './noel';

export class NoelEventImp implements NoelEvent {
    private noel: NoelImp;
    private name: string;
    private replayEnabled: boolean;
    private replayBufferSize: number;

    private replayBuffer: Array<any> | null = null;
    private listeners: Set<NoelEventListener> | null = null;

    private logger: NoelLogger;
    private noListenersWarning: boolean;

    constructor(config: NoelEventConfig) {
        config = config || {};

        if (typeof config.name === 'undefined') throw new NoelEventConfigError('config.name:string is required');
        this.name = config.name;

        if (!config.noel) throw new NoelEventConfigError('config.noel:Noel is required');
        this.noel = config.noel;

        if (config.logger) this.setLogger(config.logger);

        this.replayBufferSize = config.replayBufferSize || 1;

        config.noListenersWarning ? this.enableNoListenersWarning() : this.disableNoListenersWarning();

        this.replayEnabled = typeof config.replay === 'boolean' ? config.replay : false;
    }

    enableReplay(): void {
        this.replayEnabled = true;
    }

    disableReplay(): void {
        this.replayEnabled = false;
        this.replayBuffer = null;
    }

    emit(...eventArgs: Array<any>): void {
        const listeners = this.listeners;
        if (listeners) {
            listeners.forEach(listener => listener(...eventArgs));
        } else if (!this.replayEnabled && this.noListenersWarning) {
            this.logWarn(`Event "${this.name}" was emitted but had no listeners.`);
        }
        if (this.replayEnabled) this.pushEventArgsToReplayBuffer(eventArgs);
    }

    on(listener: NoelEventListener): NoelEventListenerManager {
        if (typeof listener !== 'function') throw new NoelEventListenerError('Given listener is not a function');
        const listeners = this.getListeners();
        listeners.add(listener);
        return new NoelEventListenerManagerImp(listener, this, this.noel);
    }

    removeListener(listener: NoelEventListener): void {
        const listeners = this.listeners;
        if (!listeners) return;
        listeners.delete(listener);
    }

    countListeners(): number {
        return this.listeners ? this.listeners.size : 0;
    }

    clearReplayBuffer(): void {
        this.replayBuffer = null;
    }

    clearListeners() {
        this.listeners = null;
    }

    setReplayBufferSize(replayBufferSize: number): void {
        if (!this.replayEnabled) throw new NoelEventReplayNotEnabled(this);
        if (replayBufferSize <= 0) throw new NoelBuffeSizeNotValidError('Replay buffer size needs to be >=1');
        this.replayBufferSize = replayBufferSize;
        const replayBuffer = this.replayBuffer;
        if (!replayBuffer) return;
        this.setReplayBuffer(replayBuffer.slice(0, replayBufferSize));
    }

    getReplayBufferAmount(replayBufferAmount: number): Array<any> {
        if (!this.replayEnabled) throw new NoelEventReplayNotEnabled(this);
        const replayBuffer = this.getReplayBuffer();
        return typeof replayBufferAmount === 'undefined' || replayBufferAmount === replayBuffer.length ? replayBuffer : replayBuffer.slice(0, replayBufferAmount);
    }

    setLogger(logger: NoelLogger) {
        this.logger = logger;
    }

    enableNoListenersWarning(): void {
        this.noListenersWarning = true;
    }

    disableNoListenersWarning(): void {
        this.noListenersWarning = false;
    }

    getName() {
        return this.name;
    }

    getLogger(): NoelLogger {
        return this.logger;
    }

    getReplayBufferSize(): number {
        return this.replayBufferSize;
    }

    getReplayIsEnabled(): boolean {
        return this.replayEnabled;
    }

    private setReplayBuffer(replayBuffer: Array<any>) {
        this.replayBuffer = replayBuffer;
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

    private logWarn(warn: string) {
        this.logger.warn(warn);
    }
}
