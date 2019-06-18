import * as Logger from "console";
import { promises as fs } from "fs";

import { LogLevel } from "..";

export function logQuery(
    query: string,
    duration: number,
    options: { logLevel: LogLevel, isError?: boolean; },
): void {
    const shortQuery = getDisplayableQuery(query);
    const logFn = options.isError ? Logger.error : Logger.log;

    const date = (new Date()).toString();
    const errorMessage = options.isError ? "ERROR: " : "";

    const screenMessage = `${errorMessage}${shortQuery} in ${duration}ms`;
    const fileMessage = `${date}: ${errorMessage}${duration}ms\n\t${query}\n`;

    const logAll = options.logLevel === LogLevel.ALL;
    const logError = options.logLevel === LogLevel.ERROR && options.isError;

    if (logAll || logError) {
        logFn(screenMessage);
        fs.writeFile("neo4j.log", fileMessage, { flag: "a" });
    }
}

function getDisplayableQuery(query: string): string {
    const QUERY_LENGTH = 100;
    const despacedQuery = query.replace(/\s+/g, " ");
    const shortQuery = despacedQuery.substr(0, QUERY_LENGTH)
        + (despacedQuery.length <= QUERY_LENGTH ? "" : " ...");

    return shortQuery;
}
