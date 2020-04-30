import { LogService } from "../service/LogService";
import { Container } from "typescript-ioc";
import { Security, Path, GET } from "typescript-rest";

@Path("/api/logs")
export class LogController {
    private logService: LogService;

    constructor(){
        this.logService = Container.get(LogService);
    }

    @Path("/")
    @GET
    @Security("ROLE_USER", "Bearer")
    public async list(){
        return this.logService.list();
    }
}