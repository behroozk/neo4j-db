import { v1 as Neo4j } from "neo4j-driver";

import { IQueryOptions } from "../types/query_options.interface";
import { INeo4jSessionOptions, INeo4jTransactionalSession } from "../types/session.interface";
import { AbstractBoltSession } from "./bolt_abstract";

export class Neo4jBoltTransactionalSession extends AbstractBoltSession implements INeo4jTransactionalSession {
    private transaction: Neo4j.Transaction;

    constructor(private session: Neo4j.Session, private options: INeo4jSessionOptions) {
        super();
        this.transaction = session.beginTransaction();
    }

    public async execute(query: string, options: IQueryOptions = {}): Promise<any> {
        const result = await this.transaction.run(query);
        return this.parseRecords(result.records, {
            singularOutput: options.stringFormatter,
            stringFormatter: this.options.stringFormatter,
        });
    }

    public async commit(): Promise<any> {
        const result = await this.transaction.commit();
        this.session.close();

        return this.parseRecords(result.records, {
            stringFormatter: this.options.stringFormatter,
        });
    }

    public async rollback(): Promise<any> {
        const result = await this.transaction.rollback();
        this.session.close();

        return this.parseRecords(result.records, {
            stringFormatter: this.options.stringFormatter,
        });
    }

    public isOpen(): boolean {
        return this.transaction.isOpen();
    }
}
