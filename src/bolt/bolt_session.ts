import * as Logger from "console";
import { v1 as Neo4j } from "neo4j-driver";

import { parseNeo4jResult } from "../parse_result";
import { IQueryOptions } from "../types/query_options.interface";
import { INeo4jSession, INeo4jSessionOptions } from "../types/session.interface";

export class Neo4jBoltSession implements INeo4jSession {
    constructor(private session: Neo4j.Session, private options: INeo4jSessionOptions) { }

    public execute(query: string, options: IQueryOptions = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            const parsedRecords: any[] = [];
            let totalParseTime = 0;
            this.session.run(query).subscribe({
                onCompleted: () => {
                    Logger.log(`Total parse time: ${totalParseTime}ms`);
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
                    const startTime = Date.now();
                    const parsedRecord = parseNeo4jResult(record, this.options.stringFormatter);
                    totalParseTime += (Date.now() - startTime);

                    if (options.singularOutput && parsedRecords.length > 1) {
                        reject(new Error(`multiple records returned in signular mode`));
                        return this.session.close();
                    }

                    parsedRecords.push(parsedRecord);
                },
            });
        });

        // promise approach to get all results at once
        // const result = await this.session.run(query);
        // this.session.close();

        // return this.parseRecords(result.records, {
        //     singularOutput: options.singularOutput,
        //     stringFormatter: this.options.stringFormatter,
        // });
    }
}
