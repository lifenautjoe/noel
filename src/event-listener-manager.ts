/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

import { NoelEvent, NoelEventListenerManager } from './interfaces';
import { NoelEventListener } from './types';

export class NoelEventListenerManagerImp implements NoelEventListenerManager {
    constructor(private listener: NoelEventListener, private event: NoelEvent) {}

    remove() {
        return this.event.removeListener(this.listener);
    }

    replay(bufferSize: number): NoelEventListenerManager {
        const eventReplayBuffer = this.event.getReplayBufferAmount(bufferSize);
        eventReplayBuffer.forEach(eventReplayBufferItem => {
            this.listener(...eventReplayBufferItem);
        });
        return this;
    }
}
