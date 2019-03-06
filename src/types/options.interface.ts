export interface INeo4jOptions {
    protocol?: Neo4jConnectionProtocol;
    host: string;
    port?: number;

    connectionLimit?: number;
    connectionTimeout?: number;

    authentication?: IClientAuthentican;

    logLevel?: LogLevel;
    logTimed?: boolean;

    resultUnescaper?: (value: string) => string;
}

export enum Neo4jConnectionProtocol {
    BOLT = "bolt",
    // HTTP = "http",
    // HTTPS = "https",
}

export enum LogLevel {
    ALL,
    ERROR,
    NONE,
}

export interface IClientAuthentican {
    username?: string;
    password?: string;
    ticket?: string;
}
