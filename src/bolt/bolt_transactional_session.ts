import { v1 as Neo4j } from "neo4j-driver";

import { parseNeo4jResult } from "../parse_result";
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
        return new Promise((resolve, reject) => {
            const parsedRecords: any[] = [];
            this.session.run(query).subscribe({
                onCompleted: () => {
                    if (options.singularOutput) {
                        resolve(parsedRecords[0]);
                    } else {
                        resolve(parsedRecords);
                    }

                    this.session.close();
                },
                onError: (error) => {
                    reject(error);
                    this.session.close();
                },
                onNext: (record) => {
                    const parsedRecord = parseNeo4jResult(record, this.options.stringFormatter);

                    if (options.singularOutput && parsedRecords.length > 1) {
                        reject(new Error(`multiple records returned in signular mode`));
                        return this.session.close();
                    }

                    parsedRecords.push(parsedRecord);
                },
            });
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
