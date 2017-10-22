/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEventListener } from './types';
import NoelImp from './noel';

export interface Noel {
    replayIsEnabled(): boolean;

    enableReplay(): void;

    disableReplay(): void;

    setReplayBufferSize(buffer: number): void;

    clearReplayBufferForEvent(eventName: string): void;

    clearEventsReplayBuffers(): void;

    setLogger(logger: NoelLogger): void;

    enableNoEventListenersWarning(): void;

    disableNoEventListenersWarning(): void;

    on(eventName: string, listener: NoelEventListener): NoelEventListenerManager;

    emit(eventName: string, ...eventArgs: Array<any>): void;

    removeListener(eventName: string, listener: NoelEventListener): void;

    getEvent(eventName: string): NoelEvent;

    removeEvent(eventName: string): void;
}

export interface NoelConfig {
    replay?: boolean;
    replayBufferSize?: number;
    noEventListenersWarning?: boolean;
    logger?: NoelLogger;
}

export interface NoelEventListenerManager {
    remove(): void;

    replay(bufferSize?: number): NoelEventListenerManager;
}

export interface NoelEvent {
    setLogger(logger: NoelLogger): void;

    enableNoListenersWarning(): void;

    disableNoListenersWarning(): void;

    enableReplay(): void;

    disableReplay(): void;

    emit(): void;

    on(listener: NoelEventListener): NoelEventListenerManager;

    removeListener(listener: NoelEventListener): void;

    clearReplayBuffer(): void;

    clearListeners(): void;

    setReplayBufferSize(replayBufferSize: number): void;

    getReplayBufferAmount(replayBufferAmount: number): Array<any>;
}

export interface NoelEventConfig {
    name: string;
    logger?: NoelLogger;
    replay?: boolean;
    replayBufferSize?: number;
    noListenersWarning?: boolean;
    noel?: NoelImp;
}

export interface NoelLogger {
    warn(warn: string): void;
}
