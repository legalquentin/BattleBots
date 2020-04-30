import { EEntityStatus } from "./EEntityStatus";

export class EntityError extends Error {
    code: EEntityStatus;

    constructor(code, message){
        super();
        this.code = code;
        this.message = message;
    }
}