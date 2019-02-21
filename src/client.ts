import { v1 as Neo4j } from 'neo4j-driver';

import { Neo4jBoltSession } from './bolt/bolt_session';
import { Neo4jBoltTransactionalSession } from './bolt/bolt_transactional_session';
import { INeo4jClient, INeo4jSession, INeo4jTransactionalSession } from './types/database.interface';
import { ConnectionProtocol, IClientAuthentican, INeo4jOptions, LogLevel } from './types/options.interface';

export class Neo4jClient implements INeo4jClient {
    private options: Required<INeo4jOptions>;
    private client: Neo4j.Driver;

    constructor(options: INeo4jOptions) {
        this.options = getCompleteClientOptions(options);

        const authToken = getAuthenticationToken(this.options.authentication);

        this.client = Neo4j.driver(
            `bolt://${options.host}:${options.port}`,
            authToken,
            {
                connectionTimeout: options.connectionTimeout,
                maxConnectionPoolSize: options.connectionLimit,
            },
        );

        // TODO: add implementation for other protocols
    }

    public getSession(): INeo4jSession {
        const session = this.client.session();
        return new Neo4jBoltSession(session);
    }

    public getTransactionalSession(): INeo4jTransactionalSession {
        const session = this.client.session();
        return new Neo4jBoltTransactionalSession(session);
    }
}

const DEFAULT_BOLT_OPTIONS = {
    authentication: {},
    connectionLimit: 8,
    connectionTimeout: 60 * 1000,
    logLevel: LogLevel.ERROR,
    logTimed: true,
    port: 7687,
    protocol: ConnectionProtocol.BOLT,
};

function getCompleteClientOptions(partialOptions: INeo4jOptions): Required<INeo4jOptions> {
    if (!partialOptions.protocol || partialOptions.protocol === ConnectionProtocol.BOLT) {
        return { ...DEFAULT_BOLT_OPTIONS, ...partialOptions };
    } else {
        throw new Error('HTTP session not implemented yet');
    }
}

function getAuthenticationToken(authentication: IClientAuthentican): Neo4j.AuthToken | undefined {
    if (authentication.username && authentication.password) {
        return Neo4j.auth.basic(authentication.username, authentication.password);
    } else if (authentication.ticket) {
        return Neo4j.auth.kerberos(authentication.ticket);
    }

    return undefined;
}
