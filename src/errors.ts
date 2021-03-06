/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

import { BaseError } from 'make-error';
import { NoelEvent } from './event';

export class NoelError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelError';
    }
}

export class NoelReplayNotEnabledError extends NoelError {
    constructor() {
        super('Replay for noel is not enabled');
        this.name = 'NoelReplayNotEnabledError';
    }
}

export class NoelEventError extends NoelError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelEventError';
    }
}

export class NoelEventReplayNotEnabled extends NoelEventError {
    constructor(event: NoelEvent) {
        super(`Replay for event "${event.getName()}" is not enabled`);
        this.name = 'NoelEventReplayNotEnabled';
    }
}

export class NoelEventConfigError extends NoelEventError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelEventConfigError';
    }
}

export class NoelEventListenerError extends NoelEventError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelEventListenerError';
    }
}

export class NoelBufferSizeNotValidError extends NoelEventError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelBufferSizeNotValidError';
    }
}
