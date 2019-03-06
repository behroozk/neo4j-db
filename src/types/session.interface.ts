import { IQueryOptions } from "./query_options.interface";

export interface INeo4jSession {
    execute(query: string, options?: IQueryOptions): Promise<any>;
}

export interface INeo4jTransactionalSession extends INeo4jSession {
    commit(): Promise<any>;
    rollback(): Promise<any>;
    isOpen(): boolean;
}

export interface INeo4jSessionOptions {
    stringFormatter?: (value: string) => string;
}
