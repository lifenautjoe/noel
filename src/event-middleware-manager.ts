/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { NoelEvent, NoelEventMiddlewareManager } from './interfaces';
import { NoelEventMiddleware } from './types';

export class NoelEventMiddlewareManagerImp implements NoelEventMiddlewareManager {
    constructor(private middleware: NoelEventMiddleware, private event: NoelEvent) {}

    remove(): void {
        return this.event.removeMiddleware(this.middleware);
    }
}
