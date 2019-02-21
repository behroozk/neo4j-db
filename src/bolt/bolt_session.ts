import { v1 as Neo4j } from 'neo4j-driver';

import { INeo4jSession } from '../types/database.interface';
import { IQueryOptions } from '../types/query_options';
import { AbstractBoltSession } from './bolt_abstract';

export class Neo4jBoltSession extends AbstractBoltSession implements INeo4jSession {
    private session: Neo4j.Session;

    constructor(session: Neo4j.Session) {
        super();
        this.session = session;
    }

    public async execute(query: string, options: IQueryOptions = {}): Promise<any> {
        const result = await this.session.run(query);
        this.session.close();

        return this.processRecords(result.records, options);
    }
}
