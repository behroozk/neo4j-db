export interface INeo4jOptions {
    protocol?: ConnectionProtocol;
    host: string;
    port?: number;

    connectionLimit?: number;
    connectionTimeout?: number;

    authentication?: IClientAuthentican;

    logLevel?: LogLevel;
    logTimed?: boolean;
}

export enum ConnectionProtocol {
    BOLT = 'bolt',
    // HTTP = 'http',
    // HTTPS = 'https',
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
