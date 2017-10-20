/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

import { NoelEventListenerManager } from './interfaces';
import { NoelEventListener } from './types';
import { NoelEventImp } from './event';
import { NoelEventReplayNotEnabled } from './errors';

export class NoelEventListenerManagerImp implements NoelEventListenerManager {
    constructor(private listener: NoelEventListener, private event: NoelEventImp) {}

    remove() {
        return this.event.removeListener(this.listener);
    }

    replay(bufferSize: number): NoelEventListenerManager {
        const event = this.event;
        if (!event.getReplayIsEnabled()) throw new NoelEventReplayNotEnabled(event);
        const actualBufferSize = event.getReplayBufferSize();
        if (bufferSize > actualBufferSize) {
            const logger = event.getLogger();
            logger.warn(`Attempted to replay ${bufferSize} emits from the event "${event.getName()}" but the replay buffer size is set to ${actualBufferSize}.`);
        }
        const eventReplayBuffer = this.event.getReplayBufferAmount(bufferSize);
        eventReplayBuffer.forEach(eventReplayBufferItem => {
            this.listener(...eventReplayBufferItem);
        });
        return this;
    }
}
