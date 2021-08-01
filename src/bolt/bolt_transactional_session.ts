import * as Neo4j from "neo4j-driver";

import * as Logger from "../logger";
import { parseNeo4jResult } from "../parse_result";
import { IQueryOptions } from "../types/query_options.interface";
import { INeo4jSessionOptions, INeo4jSession } from "../types/session.interface";
import { AbstractBoltSession } from "./bolt_abstract";

export class Neo4jBoltTransactionalSession extends AbstractBoltSession implements INeo4jSession {
    private transaction: Neo4j.Transaction;

    constructor(private session: Neo4j.Session, private options: INeo4jSessionOptions) {
        super();
        this.transaction = session.beginTransaction();
    }

    public async execute(query: string, options: IQueryOptions = {}): Promise<any> {
        return this.execWithParams(query, {}, options);
    }

    public async execWithParams(query: string, params: Record<string, any>, options: IQueryOptions = {}): Promise<any> {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const parsedRecords: any[] = [];

            this.transaction.run(query, params).subscribe({
                onCompleted: () => {
                    if (options.singularOutput) {
                        resolve(parsedRecords[0]);
                    } else {
                        resolve(parsedRecords);
                    }

                    Logger.logQuery(query, Date.now() - startTime, { logLevel: this.options.logLevel });
                },
                onError: (error) => {
                    reject(error);

                    Logger.logQuery(query, Date.now() - startTime, { logLevel: this.options.logLevel, isError: true });
                },
                onNext: (record) => {
                    const stringFormatter = Object.keys(options).indexOf("stringFormatter") > -1 ?
                        options.stringFormatter
                        :
                        this.options.stringFormatter;
                    const parsedRecord = parseNeo4jResult(record, stringFormatter);

                    if (options.singularOutput && parsedRecords.length > 1) {
                        reject(new Error(`multiple records returned in signular mode`));
                    }

                    parsedRecords.push(parsedRecord);
                },
            });
        });
    }

    public async commit(): Promise<void> {
        await this.transaction.commit();
        this.session.close();
    }

    public async rollback(): Promise<void> {
        await this.transaction.rollback();
        this.session.close();
    }

    public isOpen(): boolean {
        return this.transaction.isOpen();
    }
}
