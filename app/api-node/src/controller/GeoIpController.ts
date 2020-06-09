import { Inject } from "typescript-ioc";
import { Security, Path, GET, PreProcessor, PostProcessor } from "typescript-rest";
import { GeoIpService } from "../service/GeoIpService";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";

@Path("/api/geoip")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class GeoIpController {

    @Inject
    private geoipService: GeoIpService;

    @Path("/")
    @GET
    @Security("ROLE_USER", "Bearer")
    public async list(){
        return this.geoipService.list();
    }

    @Path("/:id")
    @GET
    @Security("ROLE_USER", "Bearer")
    public async findOne(id: number){
        return this.geoipService.findOne(id);
    }
}
