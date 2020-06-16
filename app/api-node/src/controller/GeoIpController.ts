import { Inject } from "typescript-ioc";
import { Security, Path, GET, PreProcessor, PostProcessor, PathParam } from "typescript-rest";
import { GeoIpService } from "../service/GeoIpService";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { GeoIpResourceAsm } from "../resources/asm/GeoIpResourceAsm";

@Path("/api/geoip")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class GeoIpController {

    @Inject
    private geoipService: GeoIpService;

    @Inject
    private geoipResourceAsm: GeoIpResourceAsm;

    @Path("/")
    @GET
    @Security("ROLE_USER", "Bearer")
    public async list(){
        const tab = await this.geoipService.list();

        if (tab){
            return this.geoipResourceAsm.toResources(tab);
        }
        return {
            message: "empty"
        };
    }

    @Path("/:id")
    @GET
    @Security("ROLE_USER", "Bearer")
    public async findOne(@PathParam("id") id: number){
        return this.geoipService.findOne(id);
    }
}
