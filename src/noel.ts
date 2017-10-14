// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Noel, NoelConfig } from './interfaces';

export class NoelImp implements Noel {
    constructor(config?: NoelConfig) {}
}

export * from './errors';

export * from './interfaces';

export * from './types';

export default new NoelImp();
