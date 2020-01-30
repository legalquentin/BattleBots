
import { ReferencedResource } from "typescript-rest";

/**
 * This function indicate body and http code  returned to the client 
 */
export class SendResource<T> extends ReferencedResource<T> {
    constructor(location: string, httpCode: number, body: T){
        super(location, httpCode);

        this.body = body;
    }
}
