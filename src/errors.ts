/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

import { BaseError } from 'make-error';
import { NoelEventImp } from './event';

export class NoelError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelError';
    }
}

export class NoelReplayNotEnabled extends NoelError {
    constructor() {
        super('Replay for noel is not enabled');
        this.name = 'NoelReplayNotEnabled';
    }
}

export class NoelEventError extends NoelError {
    constructor(message: string) {
        super(message);
        this.name = 'NoelEventError';
    }
}

export class NoelEventReplayNotEnabled extends NoelEventError {
    constructor(event: NoelEventImp) {
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
