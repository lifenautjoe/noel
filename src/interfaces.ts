/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEventListener, NoelEventMiddleware, NoelMiddleware } from './types';

export interface Noel {
    enableReplay(): void;

    disableReplay(): void;

    setReplayBuffer(buffer: number): void;

    getReplayBufferForEvent(eventName: string): Array<any>;

    clearReplayBufferForEvent(eventName: string): void;

    clearReplayBuffer(): void;

    setSupportedEvents(supportedEvents: Array<string>): void;

    addSupportedEvent(eventName: string): void;

    removeSupportedEvent(eventName: string): void;

    eventIsSupported(eventName: string): boolean;

    enableUnsupportedEventWarning(): void;

    disableUnsupportedEventWarning(): void;

    on(eventName: string, listener: NoelEventListener): NoelEventListenerManager;

    emit(...args: Array<any>): void;

    removeListener(eventName: string, listener: NoelEventListener): void;

    getEventManager(eventName: string): NoelEventManager;

    useMiddleware(middleware: NoelMiddleware): NoelMiddlewareManager;

    removeMiddleware(middleware: NoelMiddleware): void;

    useMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): NoelEventMiddlewareManager;

    removeMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): void;

    getChild(): Noel;
}

export interface NoelConfig {
    replay?: boolean;
    replayBuffer?: number;
    supportedEvents?: Array<string>;
    unsupportedEventWarning?: boolean;
}

export interface NoelEventManager {
    on(eventName: string, listener: NoelEventListener): NoelEventListenerManager;

    emit(...args: Array<any>): void;

    getReplayBuffer(eventName: string): Array<any>;

    clearReplayBuffer(eventName: string): void;

    useMiddleware(middleware: NoelEventMiddleware): NoelEventMiddlewareManager;

    removeMiddleware(middleware: NoelEventMiddleware): void;
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
