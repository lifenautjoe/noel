/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEventListener, NoelEventMiddleware, NoelMiddleware } from './types';

export interface Noel {
    enable(): void;

    disable(): void;

    isEnabled(): boolean;

    replayIsEnabled(): boolean;

    enableReplay(): void;

    disableReplay(): void;

    setReplayBufferAmount(buffer: number): void;

    clearReplayBufferForEvent(eventName: string): void;

    clearEventsReplayBuffers(): void;

    setSupportedEvents(supportedEvents: Array<string>): void;

    addSupportedEvent(eventName: string): void;

    removeSupportedEvent(eventName: string): void;

    eventIsSupported(eventName: string): boolean;

    enableUnsupportedEventWarning(): void;

    disableUnsupportedEventWarning(): void;

    on(eventName: string, listener: NoelEventListener): NoelEventListenerManager;

    emit(...args: Array<any>): void;

    removeListener(eventName: string, listener: NoelEventListener): void;

    getEvent(eventName: string): NoelEvent;

    useMiddleware(middleware: NoelMiddleware): NoelMiddlewareManager;

    removeMiddleware(middleware: NoelMiddleware): void;

    useMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): NoelEventMiddlewareManager;

    removeMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): void;

    namespace(namespaceName: string): Noel;
}

export interface NoelConfig {
    enabled?: boolean;
    replay?: boolean;
    replayBufferAmount?: number;
    supportedEvents?: Array<string>;
    unsupportedEventWarning?: boolean;
}

export interface NoelEventListenerManager {
    remove(): void;

    replay(bufferAmount: number): NoelEventListenerManager;
}

export interface MiddlewareManager {
    remove(): void;
}

export interface NoelEventMiddlewareManager extends NoelMiddlewareManager {}

export interface NoelMiddlewareManager extends MiddlewareManager {}

export interface NoelEvent {
    emit(): void;

    on(listener: NoelEventListener): void;

    removeListener(listener: NoelEventListener): void;

    useMiddleware(middleware: NoelEventMiddleware): NoelEventMiddlewareManager;

    removeMiddleware(middleware: NoelEventMiddleware): void;

    clearReplayBuffer(): void;
}
