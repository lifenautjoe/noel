/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */

import { NoelEventEmission } from './interfaces';

export type NoelEventListener = (...eventArgs: Array<any>) => void;

export type NoelEventMiddleware = (emission: NoelEventEmission) => void | Promise<any>;

export type NoelEventMiddlewareNextExecutor = (...eventArgs: Array<any>) => any;
