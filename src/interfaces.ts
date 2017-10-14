/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { EventListener, NoelEventMiddleware, NoelMiddleware } from './types';

export interface Noel {
    enableReplay(): void;

    disableReplay(): void;

    setReplayBuffer(buffer: number): void;

    setSupportedEvents(): void;

    addSupportedEvent(): void;

    removeSupportedEvent(): void;

    enableUnsupportedEventWarning(): void;

    disableUnsupportedEventWarning(): void;

    on(eventName: string, listener: EventListener): NoelEventListenerManager;

    emit(...args: Array<any>): void;

    removeListener(eventName: string, listener: EventListener): void;

    getEventManager(eventName: string): NoelEventManager;

    useMiddleware(middleware: NoelMiddleware): NoelMiddlewareManager;

    removeMiddleware(middleware: NoelMiddleware): void;

    useEventMiddleware(eventName: string, middleware: NoelEventMiddleware): NoelEventMiddlewareManager;

    removeEventMiddleware(eventName: string, middleware: NoelEventMiddleware): void;

    getChild(): Noel;
}

export interface NoelConfig {
    replay: boolean;
    replayBuffer: number;
}

export interface NoelEventManager {
    on(eventName: string, listener: EventListener): NoelEventListenerManager;

    emit(...args: Array<any>): void;
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
