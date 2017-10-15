// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig, NoelEventData, NoelEventMiddlewareManager, NoelMiddlewareManager } from './interfaces';
import { NoelEventMiddleware, NoelMiddleware } from './types';
import { NoelMiddlewareManagerImp } from './middleware-manager';
import { eventNames } from 'cluster';
import { NoelEventMiddlewareManagerImp } from './event-middleware-manager';
import { NoelEventNotSupportedError } from './errors';

export class NoelImp implements Noel {
    private enabled: boolean;
    private unsupportedEventWarning: boolean;

    private supportedEvents: Set<string>;
    private events: Map<string, NoelEventData>;
    private middlewares: Set<NoelMiddleware>;

    private replayEnabled: boolean;
    private replayBufferAmount: number;

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

    setReplayBufferAmount(replayBufferAmount: number) {
        this.replayBufferAmount = replayBufferAmount;
        this.trimEventsReplayBuffers(this.replayBufferAmount);
    }

    clearEventsReplayBuffers() {
        const eventsData = this.getEventsData();
        for (const eventData of eventsData) {
            eventData.replayBuffer = null;
        }
    }

    clearReplayBufferForEvent(eventName: string) {
        const eventData = this.events.get(eventName);
        if (eventData) eventData.replayBuffer = null;
    }

    useMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): NoelEventMiddlewareManager {
        if (!this.eventIsSupported(eventName)) throw new NoelEventNotSupportedError(eventName);
        const eventData = this.getEventData(eventName);
        const eventMiddlewares = eventData.middlewares || (eventData.middlewares = new Set<NoelEventMiddleware>());
        eventMiddlewares.add(middleware);
        return new NoelEventMiddlewareManagerImp(eventName, middleware, this);
    }

    removeMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): void {
        const eventMiddlewares = this.getEventMiddlewares(eventName);
        if (!eventMiddlewares) return;
        eventMiddlewares.delete(middleware);
    }

    useMiddleware(middleware: NoelMiddleware): NoelMiddlewareManager {
        this.middlewares.add(middleware);
        return new NoelMiddlewareManagerImp(middleware, this);
    }

    removeMiddleware(middleware: NoelMiddleware): void {
        this.middlewares.delete(middleware);
    }

    private getEventMiddlewares(eventName: string): Set<NoelEventMiddleware> | undefined | null {
        const eventData = this.events.get(eventName);
        if (!eventData) return;
        return eventData.middlewares;
    }

    private getEventData(eventName: string): NoelEventData {
        let eventData = this.events.get(eventName);
        if (!eventData) {
            eventData = this.makeEventData();
            this.events.set(eventName, eventData);
        }
        return eventData;
    }

    private makeEventData(): NoelEventData {
        return {
            middlewares: null,
            listeners: null,
            replayBuffer: null
        };
    }

    private trimEventsReplayBuffers(replayBufferAmountToTrimTo: number) {
        if (!this.replayEnabled) return;
        const eventsData = this.getEventsData();
        for (const eventData of eventsData) {
            const eventReplayBuffer = eventData.replayBuffer;
            if (eventReplayBuffer) eventData.replayBuffer = eventReplayBuffer.slice(0, replayBufferAmountToTrimTo);
        }
    }

    private getEventsData(): IterableIterator<NoelEventData> {
        return this.events.values();
    }
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default NoelImp;
