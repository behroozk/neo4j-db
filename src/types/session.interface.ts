import { LogLevel } from "../..";
import { IQueryOptions } from "./query_options.interface";

export interface INeo4jSession {
    execute(query: string, options?: IQueryOptions): Promise<any>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    isOpen(): boolean;
}

export interface INeo4jSessionOptions {
    stringFormatter?: (value: string) => string;
    logLevel: LogLevel;
}
