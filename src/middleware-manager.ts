/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import { Noel, NoelMiddlewareManager } from './interfaces';
import { NoelMiddleware } from './types';

export class NoelMiddlewareManagerImp implements NoelMiddlewareManager {
    constructor(private middleware: NoelMiddleware, private noel: Noel) {}

    remove() {
        return this.noel.removeMiddleware(this.middleware);
    }
}
