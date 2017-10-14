// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig } from './interfaces';

export class NoelImp implements Noel {
    private supportedEvents: Set<string>;
    private unsupportedEventWarning: boolean;

    constructor(config?: NoelConfig) {
        config = config || {};

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
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default new NoelImp();
