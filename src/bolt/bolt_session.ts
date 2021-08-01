import * as Neo4j from "neo4j-driver";

import * as Logger from "../logger";
import { parseNeo4jResult } from "../parse_result";
import { IQueryOptions } from "../types/query_options.interface";
import { INeo4jSessionOptions, INeo4jSession } from "../types/session.interface";

export class Neo4jBoltSession implements INeo4jSession {
    constructor(
        private session: Neo4j.Session,
        private options: INeo4jSessionOptions,
    ) { }

    public execute(query: string, options: IQueryOptions = {}): Promise<any> {
        return this.execWithParams(query, {}, options);
    }

    public execWithParams(
        query: string,
        params: Record<string, any>,
        options: IQueryOptions = {},
    ): Promise<any> {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const parsedRecords: any[] = [];

            this.session.run(query, params).subscribe({
                onCompleted: () => {
                    if (options.singularOutput) {
                        resolve(parsedRecords[0]);
                    } else {
                        resolve(parsedRecords);
                    }

                    this.session.close();

                    Logger.logQuery(query, Date.now() - startTime, { logLevel: this.options.logLevel });
                },
                onError: (error) => {
                    reject(error);
                    this.session.close();

                    Logger.logQuery(query, Date.now() - startTime, { logLevel: this.options.logLevel, isError: true });
                },
                onNext: (record): Promise<void> => {
                    const stringFormatter = Object.keys(options).indexOf("stringFormatter") > -1 ?
                        options.stringFormatter
                        :
                        this.options.stringFormatter;
                    const parsedRecord = parseNeo4jResult(record, stringFormatter);

                    if (options.singularOutput && parsedRecords.length > 1) {
                        reject(new Error(`multiple records returned in signular mode`));
                        return this.session.close();
                    }

                    parsedRecords.push(parsedRecord);
                    return Promise.resolve();
                },
            });
        });
    }

    public commit(): Promise<void> {
        return Promise.resolve()
    }

    public rollback(): Promise<void> {
        return Promise.resolve()
    }

    public isOpen(): boolean {
        return false;
    }
}
