import { v1 as Neo4j } from "neo4j-driver";

import { IQueryOptions } from "../types/query_options.interface";
import { INeo4jSession, INeo4jSessionOptions } from "../types/session.interface";
import { AbstractBoltSession } from "./bolt_abstract";

export class Neo4jBoltSession extends AbstractBoltSession implements INeo4jSession {
    constructor(private session: Neo4j.Session, private options: INeo4jSessionOptions) {
        super();
    }

    public async execute(query: string, options: IQueryOptions = {}): Promise<any> {
        const result = await this.session.run(query);
        this.session.close();

        return this.parseRecords(result.records, {
            singularOutput: options.stringFormatter,
            stringFormatter: this.options.stringFormatter,
        });
    }
}
