<img alt="Noel logo" src="https://github.com/lifenautjoe/noel/blob/master/noel-logo.png?raw=true" width="250">

A universal, human-centric, replayable event emitter.

[![Build Status](https://travis-ci.org/lifenautjoe/noel.svg?branch=master)](https://travis-ci.org/lifenautjoe/noel) ![Human Friendly](https://img.shields.io/badge/human-friendly-brightgreen.svg) [![Coverage Status](https://coveralls.io/repos/github/lifenautjoe/noel/badge.svg?branch=master)](https://coveralls.io/github/lifenautjoe/noel?branch=master)

## Motivation

The world just like software is full of events. Sometimes these events occur while we are busy doing other things. Wouldn't it be nice to have a way to replay all events? Noel is the way.

By being able to replay events we can design reactive systems without having to worry about timing.

For example, code like

```typescript
// Check if there is a user in case we missed the userChanged event
const user = sessionService.getUser();
if(user) updateAvatarPhoto(user)

// Listen for further changes
sessionService.listenUserChanged(updateAvatarPhoto);
```

can become

```typescript
sessionService.listenUserChanged(doSomethingWithUser).replay();
```

Meaning that if the `userChanged` event was already fired, it will be replayed with the last arguments and if it gets fired again, we'll be listening.

## Features

* Event replaying. Never miss a beat.
* API designed for humans. No useless concepts to try to make sense of.

## Installation

```bash
npm install noel
```

## Usage

### Creating a noel instance

```typescript
const Noel = require('Noel');

const noel = new Noel();
```

### Emitting and listening to events

```typescript
// Listen for an event
noel.on('friday', partyAllNightLong);

// Emit an event
noel.emit('friday', arg1, arg2 ....);
```

### Replaying events

```typescript
// Replay an event once
noel.on(eventName, eventListener).replay();

// Replay an event x amount of times
noel.on(eventName, eventListener).replay(x);
```

### Disabling replay

```typescript
// When creating the noel instance
const noel = new Noel({
    replay: false
});

// At runtime
noel.disableReplay(anotherBufferSize);
```

### Enabling replay

Please do note that **replay is enabled by default**, so this should only be necessary if it was disabled at runtime.

```typescript
// At runtime
noel.enableReplay(anotherBufferSize);
```

### Removing an event listener

```typescript
noel.removeListener(eventName, eventListener);
```

### Removing all event listeners

```typescript
noel.removeAllListeners(eventName, eventListener);
```

### Clearing an event replay buffer

If you would like to clear all saved **event** emissions for replay

```typescript
noel.clearReplayBufferForEvent(eventName);
```

### Clearing all events replay buffers

If you would like to clear all saved **events** emissions for replay

```typescript
noel.clearEventsReplayBuffers();
```

### Changing the events replay buffer size

Or in human words, changing the amount of event emissions that are saved for replays.

**Default is 1.**

```typescript
// When creating the noel instance
const noel = new Noel({
    replayBufferSize: aNewBufferSize
});

// ...

// At runtime
noel.setReplayBufferSize(anotherBufferSize);
```

### Disabling the no event listeners warning

When an event is emitted, no listeners have been set AND the replay was disabled so there is no way of doing anything with the emission, a warning will be logged into the console if available. To disable this behaviour:

```typescript
// When creating the noel instance
const noel = new Noel({
    noEventListenersWarning: false
});

// ...

// At runtime
noel.disableNoEventListenersWarning();
```

### Enabling the no event listeners warning

Please do note that the **no event listeners warning is enabled by default**, so this should only be necessary if it was disabled at runtime.

```typescript
noel.enableNoEventListenersWarning();
```

## Development

### Clone the repository

```bash
git clone git@github.com:lifenautjoe/noel.git
```

### Use npm commands

* `npm t`: Run test suite
* `npm start`: Runs `npm run build` in watch mode
* `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
* `npm run test:prod`: Run linting and generate coverage
* `npm run build`: Generate bundles and typings, create docs
* `npm run lint`: Lints code
* `npm run commit`: Commit using conventional commit style \([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:\)

## TODO

* [x] 100% Relevant lines coverage
* [x] Documentation
* [ ] Website
* [ ] 100% Branch coverage

Author [Joel Hernandez](https://lifenautjoe.com)

