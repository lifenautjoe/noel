/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEventListener, NoelEventMiddleware, NoelEventMiddlewareNextExecutor } from './types';

export interface Noel {
    enable(): void;

    disable(): void;

    isEnabled(): boolean;

    replayIsEnabled(): boolean;

    enableReplay(): void;

    disableReplay(): void;

    setReplayBufferSize(buffer: number): void;

    clearReplayBufferForEvent(eventName: string): void;

    clearEventsReplayBuffers(): void;

    setSupportedEvents(supportedEvents: Array<string>): void;

    addSupportedEvent(eventName: string): void;

    removeSupportedEvent(eventName: string): void;

    eventIsSupported(eventName: string): boolean;

    setLogger(logger: NoelLogger): void;

    enableUnsupportedEventWarning(): void;

    disableUnsupportedEventWarning(): void;

    enableNoEventListenersWarning(): void;

    disableNoEventListenersWarning(): void;

    on(eventName: string, listener: NoelEventListener): NoelEventListenerManager;

    emit(eventName: string, ...eventArgs: Array<any>): void;

    removeListener(eventName: string, listener: NoelEventListener): void;

    getEvent(eventName: string): NoelEvent;

    hasEvent(eventName: string): boolean;

    useMiddleware(middleware: NoelEventMiddleware): NoelMiddlewareManager;

    removeMiddleware(middleware: NoelEventMiddleware): void;

    useMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): NoelEventMiddlewareManager;

    removeMiddlewareForEvent(eventName: string, middleware: NoelEventMiddleware): void;

    getNamespace(namespaceName: string): Noel | Array<Noel>;

    setNamespaceDelimiterSymbol(namespaceDelimiterSymbol: string): void;
}

export interface NoelConfig {
    enabled?: boolean;
    replay?: boolean;
    replayBufferSize?: number;
    supportedEvents?: Array<string>;
    unsupportedEventWarning?: boolean;
    logger?: NoelLogger;
    namespaceDelimiterSymbol?: string;
    namespace?: string;
}

export interface NoelEventListenerManager {
    remove(): void;

    replay(bufferSize: number): NoelEventListenerManager;
}

export interface MiddlewareManager {
    remove(): void;
}

export interface NoelEventEmission {
    then(executor: NoelEventMiddlewareNextExecutor): Promise<Array<any> | void>;

    next(...eventArgs: Array<void>): void;

    getEventArgs(): Array<any>;

    getEventName(): string;

    abort(reason: Error): void;

    digestMiddlewares(): void;
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

    useMiddleware(middleware: NoelEventMiddleware): NoelEventMiddlewareManager;

    removeMiddleware(middleware: NoelEventMiddleware): void;

    clearMiddlewares(): void;

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
