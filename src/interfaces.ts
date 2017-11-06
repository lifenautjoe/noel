/**
 * @author Joel Hernandez <lifenautjoe@gmail.com>
 */
import NoelImp from './noel';
import { NoelLogger } from './logger';

export interface NoelConfig {
    replay?: boolean;
    replayBufferSize?: number;
    noEventListenersWarning?: boolean;
    logger?: NoelLogger;
}

export interface NoelEventConfig {
    name: string;
    logger?: NoelLogger;
    replay?: boolean;
    replayBufferSize?: number;
    noListenersWarning?: boolean;
    noel: NoelImp;
}
