// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig } from './interfaces';

export class NoelImp implements Noel {
    private supportedEvents: Set<string>;
    private unsupportedEventWarning: boolean;
    private eventsReplayBuffers: Map<string, Array<any>>;

    private replayEnabled: boolean;
    private replayBufferAmount: number;

    constructor(config?: NoelConfig) {
        config = config || {};

        const replayEnabled = config.replay || false;
        replayEnabled ? this.enableReplay() : this.disableReplay();

        const supportedEvents = config.supportedEvents || [];
        this.setSupportedEvents(supportedEvents);

        config.unsupportedEventWarning ? this.enableUnsupportedEventWarning() : this.disableUnsupportedEventWarning();
    }

    addSupportedEvent(eventName: string) {
        this.supportedEvents.add(eventName);
    }

    removeSupportedEvent(eventName: string) {
        this.supportedEvents.delete(eventName);
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
        this.clearReplayBuffer();
    }

    disableReplay() {
        if (!this.replayEnabled) return;
        this.replayEnabled = false;
        this.removeEventsReplayBuffers();
    }

    setReplayBufferAmount(replayBufferAmount: number) {
        this.replayBufferAmount = replayBufferAmount;
        this.trimReplayBuffer(this.replayBufferAmount);
    }

    getReplayBufferForEvent(eventName: string) {
        this.eventsReplayBuffers.get(eventName);
    }

    clearReplayBufferForEvent(eventName: string) {
        this.eventsReplayBuffers.delete(eventName);
    }

    clearReplayBuffer() {
        this.eventsReplayBuffers = new Map();
    }

    private removeEventsReplayBuffers() {
        delete this.eventsReplayBuffers;
    }

    private trimReplayBuffer(replayBufferAmountToTrimTo: number) {
        this.eventsReplayBuffers.forEach((eventBuffer, eventName) => {
            const trimmedEventBuffer = eventBuffer.slice(0, replayBufferAmountToTrimTo);
            this.setReplayBufferForEvent(eventName, trimmedEventBuffer);
        });
    }

    private setReplayBufferForEvent(eventName: string, replayBuffer: Array<any>) {
        this.eventsReplayBuffers.set(eventName, replayBuffer);
    }
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default new NoelImp();
