import { Path, POST, DELETE, PathParam, PUT, GET, PreProcessor, PostProcessor, Security } from "typescript-rest";
import { ArenaService } from "../service/ArenaService";
import { IArenaResource } from "../resources/IArenaResource";
import { Container } from "typescript-ioc";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { Produces, Consumes, Response } from "typescript-rest-swagger";

@Path("/api/arena")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class ArenaController {
    private arenaService: ArenaService;

    constructor(){
        this.arenaService = Container.get(ArenaService);
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(201, "Arena inserted")
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/")
    @POST
    public async save(arena: IArenaResource) : Promise<SendResource<HttpResponseModel<IArenaResource>>>
    {
        return this.arenaService.saveOrUpdate(arena);
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource[]>>(200, "Arena list")
    @Response<HttpResponseModel<IArenaResource[]>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/")
    @GET
    public async list() : Promise<SendResource<HttpResponseModel<IArenaResource[]>>>
    {
        return (this.arenaService.findAll());
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(200, "Arena deleted")
    @Response<HttpResponseModel<IArenaResource>>(404, "Arena not found")
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/:id")
    @DELETE
    public async delete(@PathParam("id") id: number) : Promise<SendResource<HttpResponseModel<IArenaResource>>>
    {
        return (this.arenaService.deleteOne(id));
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(200, "Arena updated")
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @PUT
    @Path("/")
    public async update(arena: IArenaResource) : Promise<SendResource<HttpResponseModel<IArenaResource>>>
    {
        return (this.arenaService.saveOrUpdate(arena));
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(200, "Arena details")
    @Response<HttpResponseModel<IArenaResource>>(404, "Arena not found")
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/:id")
    @GET
    public async details(@PathParam("id") id: number){
        return (this.arenaService.findOne);
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(200, "link bot to arena")
    @Response<HttpResponseModel<IArenaResource>>(404)
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @PUT
    @Path("/:arenaId/bot/:botId")
    public async linkBot(@PathParam("arenaId") arenaId: number, @PathParam("botId") botId: number){
        return (this.arenaService.linkBot(arenaId, botId));
    }
}
