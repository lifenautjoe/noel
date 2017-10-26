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

### Emit and listen to events

```typescript
const Noel = require('Noel');

const noel = new Noel();

// Listen for an event
noel.on('friday', partyAllNightLong);



// Emit an event
noel.emit('luckyNumbersChanged', 1, 5, 9 ...);

// Remove listener
noel.removeListener('friday', partyAllNightLong);
```

### Replay events

```typescript
// Replay an event once
noel.on('userChanged', updateAvatarPhoto).replay();

// Replay an event x amount of times
noel.on('userChanged', updateAvatarPhoto).replay(x);
```

### Remove event listener



### Remove all event listeners



### 

## Advanced usage

Continue reading on the library GitBook.

## Development

### NPM scripts

* `npm t`: Run test suite
* `npm start`: Runs `npm run build` in watch mode
* `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
* `npm run test:prod`: Run linting and generate coverage
* `npm run build`: Generate bundles and typings, create docs
* `npm run lint`: Lints code
* `npm run commit`: Commit using conventional commit style \([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:\)

  Author [Joel Hernandez](https://lifenautjoe.com)



