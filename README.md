# Noel

A universal, human-centric, replayable event emitter.

[![Build Status](https://travis-ci.org/lifenautjoe/noel.svg?branch=master)](https://travis-ci.org/lifenautjoe/noel) ![Human Friendly](https://img.shields.io/badge/human-friendly-brightgreen.svg) [![Coverage Status](https://coveralls.io/repos/github/lifenautjoe/noel/badge.svg?branch=master)](https://coveralls.io/github/lifenautjoe/noel?branch=master)

## \[Work in progress\]

## Motivation

The world just like software is full of events. Sometimes these events while we are busy doing other things. Wouldn't it be nice to have a way to replay all events?

Noel aims to be that way.

By being able to replay events we can design reactive systems that can handle events generically without having to worry about the timing of events.

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
* Human API. No useless concepts to try to make sense of.

## Installation

```bash
npm install noel
```

## Usage

### Create a noel instance

```typescript
const Noel = require('Noel');

const noel = new Noel();
```

### Emit and listen to events

```typescript
// Listen for an event
noel.on('friday', partyAllNightLong);

// Emit an event
noel.emit('friday', arg1, arg2 ....);
```

### Replay events

```typescript
// Replay an event once
noel.on(eventName, eventListener).replay();

// Replay an event x amount of times
noel.on(eventName, eventListener).replay(x);
```

### Remove one event listener

```typescript
noel.removeListener(eventName, eventListener);
```

### Remove all event listeners

```typescript
noel.removeAllListeners(eventName, eventListener);
```

### Changing the events replay buffer size

Or in human words, changing the amount of event emissions that are saved for replays.

**Default is 1.**

```typescript
// When creating the noel instance
const noel = new Noel({
    replayBufferSize: aNewBufferSize
});

// At runtime
noel.setReplayBufferSize(anotherBufferSize);
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

Please do note that** replay is enabled by default**, so this should only be necessary if it was disabled at runtime.

```typescript
// At runtime
noel.enableReplay(anotherBufferSize);
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

### Disabling the no event listeners warning

### NPM scripts

* `npm t`: Run test suite
* `npm start`: Runs `npm run build` in watch mode
* `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
* `npm run test:prod`: Run linting and generate coverage
* `npm run build`: Generate bundles and typings, create docs
* `npm run lint`: Lints code
* `npm run commit`: Commit using conventional commit style \([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:\)

  Author [Joel Hernandez](https://lifenautjoe.com)



