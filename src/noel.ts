// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig, NoelEvent, NoelEventMiddlewareManager, NoelMiddlewareManager } from './interfaces';
import { NoelEventMiddleware, NoelMiddleware } from './types';
import { NoelMiddlewareManagerImp } from './middleware-manager';
import { NoelEventNotSupportedError } from './errors';
import { NoelEventImp } from './event';

export class NoelImp implements Noel {
    private enabled: boolean;
    private unsupportedEventWarning: boolean;

    private supportedEvents: Set<string>;
    private events: Map<string, NoelEvent>;
    private middlewares: Set<NoelMiddleware>;

    private replayEnabled: boolean;
    private replayBufferSize: number;

    constructor(config?: NoelConfig) {
        config = config || {};

        const enabled = typeof config.enabled === 'undefined' ? true : config.enabled;
        enabled ? this.enable() : this.disable();

        const replayEnabled = config.replay || false;
        replayEnabled ? this.enableReplay() : this.disableReplay();

        const supportedEvents = config.supportedEvents || [];
        this.setSupportedEvents(supportedEvents);

        config.unsupportedEventWarning ? this.enableUnsupportedEventWarning() : this.disableUnsupportedEventWarning();
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
        this.supportedEvents.add(eventName);
    }

    removeSupportedEvent(eventName: string) {
        this.supportedEvents.delete(eventName);
        this.events.delete(eventName);
    }

    setSupportedEvents(supportedEvents: Array<string>) {
        this.supportedEvents = new Set(supportedEvents);
    }

    eventIsSupported(eventName: string) {
        return this.supportedEvents.size === 0 || this.supportedEvents.has(eventName);
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

    clearReplayBufferForEvent(eventName: string) {
        const event = this.events.get(eventName);
        if (event) event.clearReplayBuffer();
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

    useMiddleware(middleware: NoelMiddleware): NoelMiddlewareManager {
        this.middlewares.add(middleware);
        return new NoelMiddlewareManagerImp(middleware, this);
    }

    removeMiddleware(middleware: NoelMiddleware): void {
        this.middlewares.delete(middleware);
    }

    private getEvent(eventName: string): NoelEvent {
        let event = this.events.get(eventName);
        if (!event) {
            event = this.makeEvent(eventName);
            this.events.set(eventName, event);
        }
        return event;
    }

    private makeEvent(eventName: string): NoelEvent {
        return new NoelEventImp({
            name: eventName,
            replay: this.replayEnabled,
            replayBufferSize: this.replayBufferSize
        });
    }

    private setEventsReplayBuffersSize(replayBuffersSize: number) {
        if (!this.replayEnabled) return;
        const events = this.getEvents();
        for (const event of events) {
            event.setReplayBufferSize(replayBuffersSize);
        }
    }

    private getEvents(): IterableIterator<NoelEvent> {
        return this.events.values();
    }
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default NoelImp;
