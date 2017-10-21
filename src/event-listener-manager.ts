/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

import { NoelEventListenerManager } from './interfaces';
import { NoelEventListener } from './types';
import { NoelEventImp } from './event';
import { NoelEventReplayNotEnabled } from './errors';
import NoelImp from './noel';

export class NoelEventListenerManagerImp implements NoelEventListenerManager {
    constructor(private listener: NoelEventListener, private event: NoelEventImp, private noel: NoelImp) {}

    remove() {
        // We remove it from noel instead of the event itself because noel will remove it
        // if it was the last listener
        this.noel.removeEventListener(this.event, this.listener);
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
