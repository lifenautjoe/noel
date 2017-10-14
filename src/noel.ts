// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig, NoelEventData } from './interfaces';

export class NoelImp implements Noel {
    private enabled: boolean;
    private unsupportedEventWarning: boolean;

    private supportedEvents: Set<string>;
    private events: Map<string, NoelEventData>;

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
        return this.supportedEvents.has(eventName);
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
        if (this.replayEnabled) return;
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
            delete eventData.replayBuffer;
        }
    }

    clearReplayBufferForEvent(eventName: string) {
        const eventData = this.events.get(eventName);
        if (eventData) delete eventData.replayBuffer;
    }

    private trimEventsReplayBuffers(replayBufferAmountToTrimTo: number) {
        const eventsData = this.getEventsData();
        for (const eventData of eventsData) {
            const eventReplayBuffer = eventData.replayBuffer;
            const trimmedEventBuffer = eventReplayBuffer.slice(0, replayBufferAmountToTrimTo);
            eventData.replayBuffer = trimmedEventBuffer;
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
