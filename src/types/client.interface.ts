import { INeo4jSession, INeo4jTransactionalSession } from "./session.interface";

export interface INeo4jClient {
    getSession(): INeo4jSession;
    getTransactionalSession(): INeo4jTransactionalSession;
}
