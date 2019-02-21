import { v1 as Neo4j } from 'neo4j-driver';

import { parseNeo4jResult } from '../parse_result';
import { IQueryOptions } from '../types/query_options';

export abstract class AbstractBoltSession {
    protected processRecords(records: Neo4j.Record[], options: IQueryOptions = {}): any {
        const parsedRecords = records.map(parseNeo4jResult);

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
