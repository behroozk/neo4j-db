import { v1 as Neo4j } from "neo4j-driver";

import { parseNeo4jResult } from "../parse_result";
import { IParserOptions } from "../types/parser_options.interface";

export abstract class AbstractBoltSession {
    protected parseRecords(records: Neo4j.Record[], options: IParserOptions): any {
        const parsedRecords = records.map((record) => parseNeo4jResult(record, options.stringFormatter));

        if (options.singularOutput) {
            if (parsedRecords.length === 1) {
                return parsedRecords[0];
            } else {
                throw new Error(`${parseNeo4jResult.length} records returned in signular mode`);
            }
        }

        return parsedRecords;
    }
}
