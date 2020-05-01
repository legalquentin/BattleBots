import { LogService } from "../service/LogService";
import { Inject } from "typescript-ioc";
import { Security, Path, GET } from "typescript-rest";

@Path("/api/logs")
export class LogController {

    @Inject
    private logService: LogService;

    @Path("/")
    @GET
    @Security("ROLE_USER", "Bearer")
    public async list(){
        return this.logService.list();
    }
}