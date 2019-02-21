import { v1 as Neo4j } from 'neo4j-driver';

import { INeo4jTransactionalSession } from '../types/database.interface';
import { IQueryOptions } from '../types/query_options';
import { AbstractBoltSession } from './bolt_abstract';

export class Neo4jBoltTransactionalSession extends AbstractBoltSession implements INeo4jTransactionalSession {
    private session: Neo4j.Session;
    private transaction: Neo4j.Transaction;

    constructor(session: Neo4j.Session) {
        super();
        this.session = session;
        this.transaction = session.beginTransaction();
    }

    public async execute(query: string, options: IQueryOptions = {}): Promise<any> {
        const result = await this.transaction.run(query);
        return this.processRecords(result.records, options);
    }

    public async commit(): Promise<any> {
        const result = await this.transaction.commit();
        this.session.close();

        return this.processRecords(result.records);
    }

    public async rollback(): Promise<any> {
        const result = await this.transaction.rollback();
        this.session.close();

        return this.processRecords(result.records);
    }

    public isOpen(): boolean {
        return this.transaction.isOpen();
    }
}
