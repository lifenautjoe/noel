// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig, NoelEvent, NoelEventMiddlewareManager, NoelMiddlewareManager } from './interfaces';
import { NoelEventListener, NoelEventMiddleware } from './types';
import { NoelMiddlewareManagerImp } from './middleware-manager';
import { NoelEventNotSupportedError, NoelReplayNotEnabled } from './errors';
import { NoelEventImp } from './event';

export class NoelImp implements Noel {
    private enabled: boolean;
    private unsupportedEventWarning: boolean;

    private supportedEvents: Set<string> | null = null;
    private eventsMap: Map<string, NoelEvent> | null = null;
    private middlewares: Set<NoelEventMiddleware> | null = null;

    private replayEnabled: boolean;
    private replayBufferSize: number;

    constructor(config?: NoelConfig) {
        config = config || {};

        const enabled = typeof config.enabled === 'undefined' ? true : config.enabled;
        enabled ? this.enable() : this.disable();

        const replayEnabled = config.replay || false;
        replayEnabled ? this.enableReplay() : this.disableReplay();

        if (config.supportedEvents) this.setSupportedEvents(config.supportedEvents);

        config.unsupportedEventWarning ? this.enableUnsupportedEventWarning() : this.disableUnsupportedEventWarning();
    }

    removeListener(eventName: string, listener: NoelEventListener) {
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const event = eventsMap.get(eventName);
            if (event) {
                event.removeListener(listener);
                const eventListenersCount = event.countListeners();
                if (eventListenersCount === 0) this.removeEvent(eventName);
            }
        }
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    isEnabled() {
        return this.enabled;
    }

    addSupportedEvent(eventName: string) {
        const supportedEvents = this.supportedEvents;
        if (supportedEvents) {
            supportedEvents.add(eventName);
        }
    }

    removeSupportedEvent(eventName: string) {
        const supportedEvents = this.supportedEvents;
        if (supportedEvents) {
            supportedEvents.delete(eventName);
            this.removeEvent(eventName);
        }
    }

    setSupportedEvents(supportedEvents: Array<string>) {
        this.supportedEvents = new Set(supportedEvents);
    }

    eventIsSupported(eventName: string) {
        return !this.supportedEvents || this.supportedEvents.size === 0 || this.supportedEvents.has(eventName);
    }

    enableUnsupportedEventWarning() {
        this.unsupportedEventWarning = true;
    }

    disableUnsupportedEventWarning() {
        this.unsupportedEventWarning = false;
    }

    replayIsEnabled() {
        return this.replayEnabled;
    }

    enableReplay() {
        this.replayEnabled = true;
    }

    disableReplay() {
        if (!this.replayEnabled) return;
        this.replayEnabled = false;
        this.clearEventsReplayBuffers();
    }

    setReplayBufferSize(replayBufferSize: number) {
        this.replayBufferSize = replayBufferSize;
        this.setEventsReplayBuffersSize(this.replayBufferSize);
    }

    clearEventsReplayBuffers() {
        const events = this.getEvents();
        for (const event of events) {
            event.clearReplayBuffer();
        }
    }

    clearReplayBufferForEvent(eventName: string): void {
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const event = eventsMap.get(eventName);
            if (event) event.clearReplayBuffer();
        }
    }

    useMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): NoelEventMiddlewareManager {
        if (!this.eventIsSupported(eventName)) throw new NoelEventNotSupportedError(eventName);
        const event = this.getEvent(eventName);
        return event.useMiddleware(middleware);
    }

    removeMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): void {
        const event = this.getEvent(eventName);
        if (event) event.removeMiddleware(middleware);
    }

    useMiddleware(middleware: NoelEventMiddleware): NoelMiddlewareManager {
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const events = eventsMap.values();
            for (const event of events) {
                event.useMiddleware(middleware);
            }
        }
        const middlewares = this.getMiddlewares();
        middlewares.add(middleware);
        return new NoelMiddlewareManagerImp(middleware, this);
    }

    removeMiddleware(middleware: NoelEventMiddleware): void {
        const middlewares = this.middlewares;
        if (!middlewares) return;
        middlewares.delete(middleware);

        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const events = eventsMap.values();
            for (const event of events) {
                event.removeMiddleware(middleware);
            }
        }
    }

    private removeEvent(eventName: string) {
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            eventsMap.delete(eventName);
        }
    }

    private getEvent(eventName: string): NoelEvent {
        if (!this.eventIsSupported(eventName)) throw new NoelEventNotSupportedError(eventName);
        const eventsMap = this.getEventsMap();
        let event = eventsMap.get(eventName);
        if (!event) {
            event = this.makeEvent(eventName);
            eventsMap.set(eventName, event);
        }
        return event;
    }

    private makeEvent(eventName: string): NoelEvent {
        const event = new NoelEventImp({
            name: eventName,
            replay: this.replayEnabled,
            replayBufferSize: this.replayBufferSize
        });

        const noelMiddlewares = this.middlewares;

        if (noelMiddlewares) {
            noelMiddlewares.forEach(noelMiddleware => {
                event.useMiddleware(noelMiddleware);
            });
        }

        return event;
    }

    private setEventsReplayBuffersSize(replayBuffersSize: number): void {
        if (!this.replayEnabled) throw new NoelReplayNotEnabled();
        const eventsMap = this.eventsMap;
        if (eventsMap) {
            const events = eventsMap.values();
            for (const event of events) {
                event.setReplayBufferSize(replayBuffersSize);
            }
        }
    }

    private getEvents(): IterableIterator<NoelEvent> {
        const eventsMap = this.getEventsMap();
        return eventsMap.values();
    }

    private getEventsMap(): Map<string, NoelEvent> {
        return this.eventsMap || (this.eventsMap = new Map());
    }

    private getMiddlewares(): Set<NoelEventMiddleware> {
        return this.middlewares || (this.middlewares = new Set());
    }
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default NoelImp;
