// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig, NoelEvent, NoelEventListenerManager, NoelLogger } from './interfaces';
import { NoelEventListener } from './types';
import { NoelBuffeSizeNotValidError, NoelReplayNotEnabledError } from './errors';
import { NoelEventImp } from './event';
import { NoelLoggerImp } from './logger';

const defaultLogger = new NoelLoggerImp();

export class NoelImp implements Noel {
    private noEventListenersWarning: boolean;

    private eventsMap: Map<string, NoelEventImp> | null = null;

    private logger: NoelLogger;

    private replayEnabled: boolean;
    private replayBufferSize: number;

    constructor(config?: NoelConfig) {
        config = config || {};

        this.replayBufferSize = config.replayBufferSize || 1;

        this.replayEnabled = typeof config.replay === 'boolean' ? config.replay : true;

        const logger = config.logger || defaultLogger;
        this.setLogger(logger);
    }

    emit(eventName: string, ...eventArgs: Array<any>) {
        const event = this.getEvent(eventName);
        event.emit(...eventArgs);
    }

    on(eventName: string, listener: NoelEventListener): NoelEventListenerManager {
        const event = this.getEvent(eventName);
        return event.on(listener);
    }

    removeListener(eventName: string, listener: NoelEventListener) {
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const event = eventsMap.get(eventName);
            if (event) {
                this.removeEventListener(event, listener);
            }
        }
    }

    removeEventListener(event: NoelEventImp, listener: NoelEventListener) {
        event.removeListener(listener);
        const eventListenersCount = event.countListeners();
        if (eventListenersCount === 0) this.removeEvent(event.getName());
    }

    setLogger(logger: NoelLogger): void {
        this.logger = logger;
        if (this.eventsMap) {
            for (const event of this.eventsMap.values()) {
                event.setLogger(logger);
            }
        }
    }

    enableNoEventListenersWarning(): void {
        if (this.noEventListenersWarning) return;
        this.noEventListenersWarning = true;
        if (this.eventsMap) {
            for (const event of this.eventsMap.values()) {
                event.enableNoListenersWarning();
            }
        }
    }

    disableNoEventListenersWarning(): void {
        if (!this.noEventListenersWarning) return;
        this.noEventListenersWarning = false;
        if (this.eventsMap) {
            for (const event of this.eventsMap.values()) {
                event.disableNoListenersWarning();
            }
        }
    }

    replayIsEnabled() {
        return this.replayEnabled;
    }

    enableReplay() {
        this.replayEnabled = true;
    }

    disableReplay() {
        if (!this.replayEnabled) return;
        this.disableEventsReplay();
        this.replayEnabled = false;
    }

    setReplayBufferSize(replayBufferSize: number) {
        if (!this.replayEnabled) throw new NoelReplayNotEnabledError();
        if (replayBufferSize <= 0) throw new NoelBuffeSizeNotValidError('Replay buffer size needs to be >=1');
        this.replayBufferSize = replayBufferSize;
        this.setEventsReplayBuffersSize(this.replayBufferSize);
    }

    clearEventsReplayBuffers() {
        if (!this.replayEnabled) throw new NoelReplayNotEnabledError();
        const events = this.getEvents();
        for (const event of events) {
            event.clearReplayBuffer();
        }
    }

    clearReplayBufferForEvent(eventName: string): void {
        if (!this.replayEnabled) throw new NoelReplayNotEnabledError();
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const event = eventsMap.get(eventName);
            if (event) event.clearReplayBuffer();
        }
    }

    getEvent(eventName: string): NoelEvent {
        const eventsMap = this.getEventsMap();
        let event = eventsMap.get(eventName);
        if (!event) {
            event = this.makeEvent(eventName);
            eventsMap.set(eventName, event);
        }
        return event;
    }

    removeEvent(eventName: string) {
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            eventsMap.delete(eventName);
        }
    }

    private makeEvent(eventName: string): NoelEventImp {
        return new NoelEventImp({
            name: eventName,
            replay: this.replayEnabled,
            replayBufferSize: this.replayBufferSize,
            noel: this,
            logger: this.logger
        });
    }

    private setEventsReplayBuffersSize(replayBuffersSize: number): void {
        if (!this.replayEnabled) throw new NoelReplayNotEnabledError();
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const events = eventsMap.values();
            for (const event of events) {
                event.setReplayBufferSize(replayBuffersSize);
            }
        }
    }

    private disableEventsReplay() {
        if (!this.replayEnabled) throw new NoelReplayNotEnabledError();
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const events = eventsMap.values();
            for (const event of events) {
                event.disableReplay();
            }
        }
    }

    private getEvents(): IterableIterator<NoelEventImp> {
        const eventsMap = this.getEventsMap();
        return eventsMap.values();
    }

    private getEventsMap(): Map<string, NoelEventImp> {
        return this.eventsMap || (this.eventsMap = new Map());
    }
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default NoelImp;
