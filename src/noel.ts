// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig } from './interfaces';

export class NoelImp implements Noel {
    private supportedEvents: Set<string>;

    constructor(config?: NoelConfig) {
        config = config || {};
        const supportedEvents = config.supportedEvents || [];
        this.setSupportedEvents(supportedEvents);
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
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default new NoelImp();
