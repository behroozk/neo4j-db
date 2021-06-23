import { INeo4jSession } from "./session.interface";

export interface INeo4jClient {
    getSession(): INeo4jSession;
    getTransactionalSession(): INeo4jSession;
}
