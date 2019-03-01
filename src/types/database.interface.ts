import { IQueryOptions } from './query_options';

export interface INeo4jClient {
    getSession(): INeo4jSession;
    getTransactionalSession(): INeo4jTransactionalSession;
}

export interface INeo4jSession {
    execute(query: string, options?: IQueryOptions): Promise<any>;
}

export interface INeo4jTransactionalSession extends INeo4jSession {
    commit(): Promise<any>;
    rollback(): Promise<any>;
    isOpen(): boolean;
}
