/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEventListener, NoelEventMiddleware, NoelEventMiddlewareNextExecutor } from './types';

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

    hasEvent(eventName: string): boolean;
}

export interface NoelConfig {
    enabled?: boolean;
    replay?: boolean;
    replayBufferSize?: number;
    logger?: NoelLogger;
}

export interface NoelEventListenerManager {
    remove(): void;

    replay(bufferSize: number): NoelEventListenerManager;
}

export interface MiddlewareManager {
    remove(): void;
}

export interface NoelEventMiddlewareManager extends NoelMiddlewareManager {}

export interface NoelMiddlewareManager extends MiddlewareManager {}

export interface NoelEvent {
    setLogger(logger: NoelLogger): void;

    enableNoListenersWarning(): void;

    disableNoListenersWarning(): void;

    enableReplay(): void;

    disableReplay(): void;

    replayIsEnabled(): boolean;

    emit(): void;

    on(listener: NoelEventListener): NoelEventListenerManager;

    removeListener(listener: NoelEventListener): void;

    countListeners(): number;

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
}

export interface NoelLogger {
    warn(warn: string): void;
}
