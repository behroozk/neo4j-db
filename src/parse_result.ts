import { v1 as Neo4j } from 'neo4j-driver';

export function parseNeo4jResult(result: any): any {
    if (typeof result === 'string'
        || typeof result === 'boolean'
        || typeof result === 'number'
        || result === null
    ) {
        return result;
    }

    if (Array.isArray(result)) {
        return result.map((item) => parseNeo4jResult(item));
    }

    if (!result.constructor || !result.constructor.name) {
        throw new Error(`invalid data type: ${result}`);
    }

    switch (result.constructor.name) {
        case 'Record':
            const record: Neo4j.Record = result;
            const parsedRecord: any = {};

            for (const key of record.keys) {
                parsedRecord[key] = parseNeo4jResult(record.get(key));
            }

            return parsedRecord;
        case 'Integer':
            const integer: Neo4j.Integer = result;
            return integer.toNumber();
        case 'Node':
            const node: Neo4j.Node = result;
            return Object.assign(
                parseNeo4jResult(node.properties),
                { _id: node.identity.toNumber() },
            );
        case 'Relationship':
            const relationship: Neo4j.Relationship = result;
            return parseNeo4jResult(relationship.properties);
        case 'Path':
        case 'PathSegment':
        case 'Date':
        case 'Time':
        case 'LocalTime':
        case 'DateTime':
        case 'LocalDateTime':
        case 'Duration':
            return result; // TODO: complete implementation for each
        case 'Point':
            const point: Neo4j.Point = result;
            return { x: point.x, y: point.y, z: point.z };
        default:
            const output: any = {};
            for (const key of Object.keys(result)) {
                output[key] = parseNeo4jResult(result[key]);
            }
            return output;
    }
}
