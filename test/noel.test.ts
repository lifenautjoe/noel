import Noel from '../src/noel';
import { NoelLoggerImp } from '../src/logger';
import { NoelEventConfigError, NoelEventListenerError } from '../src/errors';
import { NoelEventListenerManager } from '../src/interfaces';
import { NoelEventListenerManagerImp } from '../src/event-listener-manager';
import { NoelEventImp } from '../src/event';

describe('Noel', () => {
    const defaultReplayEnabledVal = true;
    const defaultReplayBufferSize = 1;

    describe('constructor()', () => {
        it('should have default config set', () => {
            const noel = new Noel();

            expect(noel['replayEnabled']).toBe(defaultReplayEnabledVal);
            expect(noel['replayBufferSize']).toBe(defaultReplayBufferSize);
            const logger = noel['logger'];
            expect(logger).toBeDefined();
            expect(typeof logger.warn === 'function').toBeTruthy();
        });
    });

    describe('constructor(config)', () => {
        it('should override default config', () => {
            const logger = new NoelLoggerImp();
            const replay = false;
            const replayBufferSize = 20;

            const noel = new Noel({
                replay,
                replayBufferSize,
                logger
            });
            expect(noel['logger']).toBe(logger);
            expect(noel['replayBufferSize']).toBe(replayBufferSize);
            expect(noel['replayEnabled']).toBe(replay);
        });
    });

    describe('replayIsEnabled()', () => {
        it('should return whether the replay is enabled', () => {
            const noel = new Noel();
            const replayIsEnabled = noel.replayIsEnabled();
            expect(replayIsEnabled).toBe(defaultReplayEnabledVal);
        });
    });

    describe('on(eventName: string, eventListener: NoelEventListener)', () => {
        describe('when no eventName is given', () => {
            it('should throw a NoelEventConfigError', () => {
                const noel = new Noel();
                expect(() => {
                    noel.on(undefined, () => {});
                }).toThrow(NoelEventConfigError);
            });
        });

        describe('when no eventListener is given', () => {
            it('should throw a NoelEventConfigError', () => {
                const noel = new Noel();
                expect(() => {
                    noel.on('anEvent', undefined);
                }).toThrow(NoelEventListenerError);
            });
        });

        describe('when given proper arguments', () => {
            it('should add the event listener', () => {
                const noel = new Noel();
                const eventName = generateRandomString();
                const eventListener = () => {};
                noel.on(eventName, eventListener);
                const event = noel['eventsMap'].get(eventName);
                expect(event).toBeInstanceOf(NoelEventImp);
                expect(event['name']).toBe(eventName);
                expect(event['listeners'].has(eventListener)).toBeTruthy();
            });

            it('should return an EventListenerManager', () => {
                const noel = new Noel();
                const eventListenerManager = noel.on('anotherEvent', () => {});
                expect(eventListenerManager).toBeInstanceOf(NoelEventListenerManagerImp);
            });
        });

        describe(':EventListenerManager', () => {
            describe('remove()', () => {
                describe('when its the only event listener left', () => {
                    it('should remove the event', () => {
                        const noel = new Noel();
                        const eventName = generateRandomString();
                        const eventListener = () => {};
                        const eventListenerManager = noel.on(eventName, eventListener);
                        eventListenerManager.remove();
                        const event = noel['eventsMap'].get(eventName);
                        expect(event).toBeUndefined();
                    });
                });

                describe('when the event has more listeners', () => {
                    it('should remove the event listener', () => {
                        const noel = new Noel();
                        const eventName = generateRandomString();
                        const eventListener = () => {};
                        const secondEventListener = () => {};
                        const eventListenerManager = noel.on(eventName, eventListener);
                        noel.on(eventName, secondEventListener);
                        eventListenerManager.remove();
                        const event = noel['eventsMap'].get(eventName);
                        expect(event).toBeInstanceOf(NoelEventImp);
                        const eventListeners = event['listeners'];

                        expect(eventListeners.has(secondEventListener)).toBeTruthy();
                        expect(eventListeners.has(eventListener)).toBeFalsy();
                    });
                });
            });

            describe('when replay is enabled', () => {
                let noel;
                beforeEach(() => {
                    noel = new Noel({
                        replay: true
                    });
                });

                describe('replay(?bufferSize)', () => {
                    describe('when bufferSize is undefined', () => {
                        it('should replay the last buffered emit', () => {
                            const noel = new Noel();
                            const eventName = generateRandomString();
                            const eventData = generateRandomItem();
                            const listener = jest.fn();
                            noel.emit(eventName, eventData);
                            noel.on(eventName, listener).replay();
                            expect(listener).toHaveBeenCalledWith(eventData);
                        });
                    });

                    describe('when bufferSize < availableBufferSize', () => {
                        it('should replay the requested buffered emits', () => {
                            const bufferSize = generateRandomIntegerBetween(1, 10);

                            const bufferToReplay = generateRandomIntegerBetween(1, bufferSize);
                            const noel = new Noel({
                                replay: true,
                                replayBufferSize: bufferSize
                            });
                            const eventName = generateRandomString();

                            const emitArgs = [];

                            // Fill up the buffer
                            for (let i = 0; i < bufferSize; i++) {
                                const emitArg = generateRandomItem();
                                noel.emit(eventName, emitArg);
                                emitArgs.push(emitArg);
                            }

                            const listener = jest.fn();
                            noel.on(eventName, listener).replay(bufferToReplay);

                            expect(listener).toHaveBeenCalledTimes(bufferToReplay);

                            for (let i = 0; i < bufferToReplay; i++) {
                                expect(listener).toHaveBeenCalledWith(emitArgs[i]);
                            }
                        });
                    });

                    describe('when bufferSize > availableBufferSize', () => {
                        it('should replay the available buffer emits and show a warning', () => {});
                    });
                });
            });
        });
    });
});

// For all smarty pants around, I am well aware this is pseudo-random

function generateRandomItem(skipArr?) {
    const itemType = generateRandomIntegerBetween(0, skipArr ? 5 : 6);
    let randomItem;
    switch (itemType) {
        case 0:
            randomItem = {};
            break;
        case 1:
            randomItem = generateRandomBoolean();
            break;
        case 2:
            randomItem = undefined;
            break;
        case 3:
            randomItem = null;
            break;
        case 4:
            randomItem = generateRandomIntegerBetween(0, 1000);
            break;
        case 5:
            randomItem = generateRandomString();
            break;
        case 6:
            randomItem = generateRandomArray();
    }
    return randomItem;
}

function generateRandomArray() {
    const arr = [];
    const arrSize = generateRandomIntegerBetween(0, 100);
    for (let i = 0; i < arrSize; i++) {
        arr.push(generateRandomItem(true));
    }
    return arr;
}

function generateRandomString() {
    return generateRandomIntegerBetween(0, 1000).toString();
}

function generateRandomBoolean() {
    return !generateRandomIntegerBetween(0, 1);
}

function generateRandomIntegerBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
