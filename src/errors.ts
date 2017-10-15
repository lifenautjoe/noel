/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

import { BaseError } from 'make-error';

export class NoelError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelError';
    }
}

export class NoelConfigError extends NoelError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelConfigError';
    }
}

export class NoelEventError extends NoelError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelEventError';
    }
}

export class NoelEventNotSupportedError extends NoelEventError {
    constructor(eventName: string) {
        super(`The event "${eventName}" is not supported`);
        this.name = 'NoelEventNotSupportedError';
    }
}

export class NoelEventBufferOutOfBoundsError extends NoelEventError {
    constructor(desiredBufferSize: number, actualBufferSize: number) {
        super(`The available event buffer is "${actualBufferSize}". Attempted to access ${desiredBufferSize}`);
        this.name = 'NoelEventBufferOutOfBoundsError';
    }
}

export class NoelEventEmissionWasAborted extends NoelEventError {
    constructor(eventName: string) {
        super(`The emission of the event "${eventName} has been aborted."`);
        this.name = 'NoelEventEmissionWasAborted';
    }
}

export class NoelEventReplayNotEnabled extends NoelEventError {
    constructor(eventName: string) {
        super(`Replay for event "${eventName}" is not enabled`);
        this.name = 'NoelEventReplayNotEnabled';
    }
}

export class NoelEventConfigError extends NoelEventError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelEventConfigError';
    }
}
