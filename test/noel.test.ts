import Noel from '../src/noel';
import { NoelLoggerImp } from '../src/logger';
import { NoelBuffeSizeNotValidError, NoelEventConfigError, NoelEventListenerError, NoelEventReplayNotEnabled, NoelReplayNotEnabledError } from '../src/errors';
import { NoelEventListenerManagerImp } from '../src/event-listener-manager';
import { NoelEventImp } from '../src/event';
import { NoelEvent } from '../src/interfaces';

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

    describe('setLogger(logger: NoelLogger)', () => {
        it('should override the previous logger', () => {
            const noel = new Noel();
            const newLogger = {
                warn: () => {}
            };
            fillNoelWithRandomEvents(noel);
            noel.setLogger(newLogger);
            expect(noel['logger']).toBe(newLogger);
            const events = noel['eventsMap'];
            for (const event of events.values()) {
                expect(event['logger']).toBe(newLogger);
            }
        });
    });

    describe('getEvent(): NoelEvent', () => {
        describe('when the event already exists', () => {
            it('should return the existing event', () => {
                const noel = new Noel();
                const eventName = generateRandomString();
                noel.on(eventName, () => {});
                noel.emit(eventName, generateRandomItem());
                const event = noel['eventsMap'].get(eventName);
                expect(noel.getEvent(eventName)).toBe(event);
            });
        });

        describe('when the event does not exist', () => {
            it('should create, save and return the new event', () => {
                const noel = new Noel();
                const eventName = generateRandomString();
                const event = noel.getEvent(eventName);
                expect(event).toBeInstanceOf(NoelEventImp);
                expect(noel['eventsMap'].get(eventName)).toBe(event);
            });
        });
    });

    describe('removeEvent()', () => {
        describe('when the event exists', () => {
            it('it should remove the event', () => {
                const noel = new Noel();
                const eventName = generateRandomString();
                noel.on(eventName, () => {});
                noel.removeEvent(eventName);
                expect(noel['eventsMap'].get(eventName)).toBeUndefined();
            });
        });

        describe('when the event doesnt exist', () => {
            it('should do nothing', () => {
                const noel = new Noel();
                noel.removeEvent(generateRandomString());
                expect(noel['eventsMap']).toBeNull();
            });
        });
    });

    describe('removeListener(eventName: string, eventListener: NoelEventListener)', () => {
        describe('if its the last event listener', () => {
            it('should remove the event', () => {
                const listener = () => {};
                const noel = new Noel();
                const eventName = generateRandomString();
                noel.on(eventName, listener);
                noel.removeListener(eventName, listener);
                expect(noel['eventsMap'].get(eventName)).toBeUndefined();
            });
        });

        describe('if the event has more listeners', () => {
            it('should remove the listener from the event', () => {
                const listener = () => {};
                const noel = new Noel();
                const eventName = generateRandomString();
                fillNoelWithRandomEventListeners(noel, eventName);
                noel.on(eventName, listener);
                noel.removeListener(eventName, listener);
                const event = noel['eventsMap'].get(eventName);
                expect(event).toBeInstanceOf(NoelEventImp);
                expect(event['listeners'].has(listener)).toBe(false);
            });
        });
    });

    describe('replayIsEnabled()', () => {
        it('should return whether the replay is enabled', () => {
            const noel = new Noel();
            const replayIsEnabled = noel.replayIsEnabled();
            expect(replayIsEnabled).toBe(defaultReplayEnabledVal);
        });
    });

    describe('enableReplay()', () => {
        it('should enable replay', () => {
            const noel = new Noel({
                replay: false
            });
            noel.enableReplay();
            expect(noel['replayEnabled']).toBe(true);
        });
    });

    describe('disableReplay()', () => {
        it('should disable replay and set events replayBuffer=null & replayEnabled=false', () => {
            const noel = new Noel({
                replay: true
            });

            const numberOfEvents = generateRandomIntegerBetween(1, 10);
            for (let i = 0; i < numberOfEvents; i++) {
                noel.on(generateRandomString(), () => {});
            }
            noel.disableReplay();
            expect(noel['replayEnabled']).toBe(false);
            const events = noel['eventsMap'].values();
            for (const event of events) {
                expect(event['replayBuffer']).toBeNull();
                expect(event['replayEnabled']).toBe(false);
            }
        });
    });

    describe('enableNoEventListenersWarning()', () => {
        it('should enable the no event listeners warning', () => {
            const noel = new Noel({
                replay: false
            });
            fillNoelWithRandomEvents(noel);
            noel.enableNoEventListenersWarning();
            const events = noel['eventsMap'];
            expect(noel['noEventListenersWarning']).toBe(true);
            for (const event of events.values()) {
                expect(event['noListenersWarning']).toBe(true);
            }
        });
    });

    describe('disableNoEventListenersWarning()', () => {
        it('should disable the no event listeners warning', () => {
            const noel = new Noel({
                replay: false
            });
            fillNoelWithRandomEvents(noel);
            noel.disableNoEventListenersWarning();
            const events = noel['eventsMap'];
            expect(noel['noEventListenersWarning']).toBe(false);
            for (const event of events.values()) {
                expect(event['noListenersWarning']).toBe(false);
            }
        });
    });

    describe('replayIsEnabled()', () => {
        describe('when replay is enabled', () => {
            it('should return true', () => {
                const noel = new Noel({
                    replay: true
                });
                expect(noel.replayIsEnabled()).toBe(true);
            });
        });

        describe('when replay is disabled', () => {
            it('should return false', () => {
                const noel = new Noel({
                    replay: false
                });
                expect(noel.replayIsEnabled()).toBe(false);
            });
        });
    });

    describe('clearEventsReplayBuffers()', () => {
        describe('when replay is enabled', () => {
            it('should clear the events replay buffers', () => {
                const replayBufferSize = generateRandomIntegerBetween(1, 100);
                const noel = new Noel({
                    replay: true,
                    replayBufferSize
                });
                const numberOfEvents = generateRandomIntegerBetween(1, 10);
                for (let i = 0; i < numberOfEvents; i++) {
                    const eventName = generateRandomString();
                    noel.on(eventName, () => {});
                    for (let j = 0; j < generateRandomIntegerBetween(0, replayBufferSize); j++) {
                        noel.emit(eventName, generateRandomItem());
                    }
                }
                const events = noel['eventsMap'];
                for (const event of events.values()) {
                    expect(event['replayBuffer']).toBeDefined();
                }
                noel.clearEventsReplayBuffers();
                for (const event of events.values()) {
                    expect(event['replayBuffer']).toBeNull();
                }
            });
        });

        describe('when replay is not enabled', () => {
            it('should throw a NoelReplayNotEnabledError', () => {
                const noel = new Noel({
                    replay: false
                });

                expect(() => {
                    noel.clearEventsReplayBuffers();
                }).toThrow(NoelReplayNotEnabledError);
            });
        });
    });

    describe('setReplayBufferSize(bufferSize: number)', () => {
        describe('when replay is enabled', () => {
            describe('when bufferSize > 0', () => {
                describe('when an event has already been emitted', () => {
                    it('should slice the events replayBuffer:Array to the given bufferSize', () => {
                        const eventName = generateRandomString();
                        const initialReplayBufferSize = generateRandomIntegerBetween(1, 100);
                        const newReplayBufferSize = generateRandomIntegerBetween(1, initialReplayBufferSize / 2);

                        const noel = new Noel({
                            replay: true,
                            replayBufferSize: initialReplayBufferSize
                        });

                        for (let i = 0; i < initialReplayBufferSize; i++) {
                            noel.emit(eventName, generateRandomItem());
                        }

                        const event = noel.getEvent(eventName);
                        noel.setReplayBufferSize(newReplayBufferSize);
                        expect(event['replayBuffer'].length).toBe(newReplayBufferSize);
                    });

                    it('should set the events replayBufferSize to the given bufferSize', () => {
                        const eventName = generateRandomString();
                        const initialReplayBufferSize = generateRandomIntegerBetween(1, 100);
                        const newReplayBufferSize = generateRandomIntegerBetween(1, initialReplayBufferSize / 2);

                        const noel = new Noel({
                            replay: true,
                            replayBufferSize: initialReplayBufferSize
                        });

                        for (let i = 0; i < initialReplayBufferSize; i++) {
                            noel.emit(eventName, generateRandomItem());
                        }

                        const event = noel.getEvent(eventName);
                        noel.setReplayBufferSize(newReplayBufferSize);

                        expect(event['replayBufferSize']).toBe(newReplayBufferSize);
                    });
                });

                describe('when an event has not been emitted', () => {
                    it('should set the event replayBufferSize:number to the given bufferSize', () => {
                        const noel = new Noel({
                            replay: true
                        });
                        const eventName = generateRandomString();
                        const newReplayBufferSize = generateRandomIntegerBetween(1, 100);

                        noel.on(eventName, () => {});

                        const event = noel.getEvent(eventName);
                        noel.setReplayBufferSize(newReplayBufferSize);

                        expect(event['replayBufferSize']).toBe(newReplayBufferSize);
                    });

                    it('should not create an event replayBuffer:Array', () => {
                        const noel = new Noel({
                            replay: true
                        });
                        const eventName = generateRandomString();
                        const newReplayBufferSize = generateRandomIntegerBetween(1, 100);

                        noel.on(eventName, () => {});

                        const event = noel.getEvent(eventName);
                        noel.setReplayBufferSize(newReplayBufferSize);

                        expect(event['replayBuffer']).toBeNull();
                    });
                });
            });

            describe('when bufferSize <=0', () => {
                it('should throw a NoelBuffeSizeNotValidError', () => {
                    const noel = new Noel({
                        replay: true,
                        replayBufferSize: generateRandomIntegerBetween(1, 100)
                    });
                    expect(() => {
                        const newReplayBufferSize = generateRandomIntegerBetween(-100, 0);
                        noel.setReplayBufferSize(newReplayBufferSize);
                    }).toThrow(NoelBuffeSizeNotValidError);
                });
            });
        });

        describe('when replay is disabled', () => {
            it('should throw a NoelReplayNotEnabledError', () => {
                const noel = new Noel({
                    replay: false
                });

                expect(() => {
                    noel.setReplayBufferSize(generateRandomIntegerBetween(1, 100));
                }).toThrow(NoelReplayNotEnabledError);
            });
        });
    });

    describe('clearReplayBufferForEvent()', () => {
        describe('when replay is enabled', () => {
            describe('when the event does not exist', () => {
                it('should not do anything', () => {
                    const noel = new Noel({
                        replay: true
                    });

                    const hasSiblingEvents = generateRandomBoolean();
                    if (hasSiblingEvents) {
                        for (let i = 0; i < generateRandomIntegerBetween(1, 10); i++) {
                            noel.on(generateRandomString(), () => {});
                        }
                    }

                    const eventName = generateRandomString();
                    noel.clearReplayBufferForEvent(eventName);

                    if (hasSiblingEvents) {
                        expect(noel['eventsMap'].get(eventName)).toBeUndefined();
                    } else {
                        expect(noel['eventsMap']).toBeNull();
                    }
                });
            });

            describe('when the event exists', () => {
                describe('when the event has already been emitted', () => {
                    it('should clear the event replay buffer', () => {
                        const replayBufferSize = generateRandomIntegerBetween(1, 10);
                        const noel = new Noel({
                            replay: true,
                            replayBufferSize: replayBufferSize
                        });

                        const eventName = generateRandomString();
                        for (let i = 0; i < replayBufferSize; i++) {
                            noel.emit(eventName, generateRandomItem());
                        }
                        const event = noel.getEvent(eventName);
                        expect(event['replayBuffer']).toBeDefined();
                        noel.clearReplayBufferForEvent(eventName);
                        expect(event['replayBuffer']).toBeNull();
                    });
                });

                describe('when the event has not yet been emitted', () => {
                    it('should not do anything', () => {
                        const noel = new Noel({
                            replay: true
                        });

                        const eventName = generateRandomString();
                        const event = noel.getEvent(eventName);
                        expect(event['replayBuffer']).toBeNull();
                        noel.clearReplayBufferForEvent(eventName);
                        expect(event['replayBuffer']).toBeNull();
                    });
                });
            });
        });

        describe('when replay is disabled', () => {
            it('should throw a NoelReplayNotEnabledError', () => {
                const noel = new Noel({
                    replay: false
                });
                const eventName = generateRandomString();
                expect(() => {
                    noel.clearReplayBufferForEvent(eventName);
                }).toThrow(NoelReplayNotEnabledError);
            });
        });
    });

    describe('emit(eventName:string, ...eventArgs: Array<any>)', () => {
        it('should call the listeners with the eventArgs', () => {
            const noel = new Noel();
            const eventName = generateRandomString();
            const eventListeners = fillNoelWithRandomEventListeners(noel, eventName);
            const eventArgs = generateRandomArray();
            noel.emit(eventName, ...eventArgs);

            eventListeners.forEach(eventListener => {
                expect(eventListener).toHaveBeenCalledWith(...eventArgs);
            });
        });

        describe('when replay is enabled', () => {
            describe('when the event has listeners', () => {
                it('should add the eventArgs to the replay buffer', () => {
                    const replayBufferSize = generateRandomIntegerBetween(1, 20);
                    const noel = new Noel({
                        replay: true,
                        replayBufferSize
                    });
                    const eventName = generateRandomString();
                    fillNoelWithRandomEventListeners(noel, eventName);

                    const emitAmount = generateRandomIntegerBetween(1, replayBufferSize);
                    const emitArgs = emitNoelEventWithRandomArgs(noel, eventName, emitAmount);

                    const event = noel['eventsMap'].get(eventName);
                    const eventReplayBuffer = event['replayBuffer'];

                    eventReplayBuffer.forEach(eventReplayBufferItem => {
                        eventReplayBufferItem.forEach(value => {
                            expect(emitArgs).toContain(value);
                        });
                    });
                });
            });

            describe('when the event has no listeners', () => {
                it('should not log a warning', () => {
                    const logger = {
                        warn: jest.fn()
                    };
                    const noel = new Noel({
                        replay: true,
                        logger
                    });
                    noel.emit(generateRandomString(), () => {});
                    expect(logger.warn).not.toHaveBeenCalled();
                });
            });
        });

        describe('when replay is not enabled', () => {
            describe('when the event has listeners', () => {
                it('should not add the eventArgs to the replay buffer', () => {
                    const noel = new Noel({
                        replay: false
                    });
                    const eventName = generateRandomString();
                    fillNoelWithRandomEventListeners(noel, eventName);

                    emitNoelEventWithRandomArgs(noel, eventName);

                    const event = noel['eventsMap'].get(eventName);
                    expect(event['replayBuffer']).toBeNull();
                });
            });

            describe('when the event has no listeners', () => {
                it('should log a warning', () => {
                    const logger = {
                        warn: jest.fn()
                    };
                    const noel = new Noel({
                        replay: false,
                        logger
                    });
                    const eventName = generateRandomString();
                    noel.emit(eventName, generateRandomItem());

                    expect(logger.warn).toHaveBeenCalledWith(`Event "${eventName}" was emitted but had no listeners.`);
                });
            });
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
                        const numberOfOtherListeners = generateRandomIntegerBetween(1, 20);
                        const otherListeners = [];
                        for (let i = 0; i < numberOfOtherListeners; i++) {
                            const otherListener = () => {};
                            noel.on(eventName, otherListener);
                            otherListeners.push(otherListener);
                        }
                        const eventListener = () => {};

                        const eventListenerManager = noel.on(eventName, eventListener);
                        eventListenerManager.remove();

                        const event = noel['eventsMap'].get(eventName);
                        expect(event).toBeInstanceOf(NoelEventImp);

                        const eventListeners = event['listeners'];
                        otherListeners.forEach(otherListener => {
                            expect(eventListeners.has(otherListener));
                        });

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
                        it('should replay the available buffer emits and show a warning', () => {
                            const bufferSize = generateRandomIntegerBetween(1, 10);
                            const bufferToReplay = bufferSize + 1;
                            const logger = {
                                warn: jest.fn()
                            };
                            const noel = new Noel({
                                replay: true,
                                logger,
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

                            expect(listener).toHaveBeenCalledTimes(bufferSize);

                            for (let i = 0; i < bufferSize; i++) {
                                expect(listener).toHaveBeenCalledWith(emitArgs[i]);
                            }

                            const expectedWarnMessage = `Attempted to replay ${bufferToReplay} emits from the event "${eventName}" but the replay buffer size is set to ${bufferSize}.`;
                            expect(logger.warn).toHaveBeenCalledWith(expectedWarnMessage);
                        });
                    });
                });
            });

            describe('when replay is disabled', () => {
                it('should throw a NoelEventReplayNotEnabled error', () => {
                    const noel = new Noel({
                        replay: false
                    });
                    const eventName = generateRandomString();
                    expect(() => {
                        noel.on(eventName, () => {}).replay();
                    }).toThrow(NoelEventReplayNotEnabled);
                });
            });
        });
    });
});

// For all smarty pants around, I am well aware this is pseudo-random

function emitNoelEventWithRandomArgs(noel, eventName, emitAmount?) {
    const eventEmits = emitAmount || generateRandomIntegerBetween(1, 20);
    const args = [];
    for (let i = 0; i < eventEmits; i++) {
        const arg = generateRandomItem();
        noel.emit(eventName, arg);
        args.push(arg);
    }
    return args;
}

function fillNoelWithRandomEventListeners(noel, eventName) {
    const listenersAmount = generateRandomIntegerBetween(1, 20);
    const listeners = [];
    for (let i = 0; i < listenersAmount; i++) {
        const listener = jest.fn();
        noel.on(eventName, listener);
        listeners.push(listener);
    }
    return listeners;
}

function fillNoelWithRandomEvents(noel: Noel) {
    const numberOfEvents = generateRandomIntegerBetween(1, 10);
    for (let i = 0; i < numberOfEvents; i++) {
        const eventName = generateRandomString();
        noel.on(eventName, () => {});
    }
}

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
