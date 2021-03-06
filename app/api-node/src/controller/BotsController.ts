import { Path, PreProcessor, PostProcessor, GET, POST, PathParam, DELETE, PUT, Security  } from "typescript-rest";
import { BotsService } from "../service/BotsService";
import { Inject } from "typescript-ioc";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import HttpResponseModel from "../resources/HttpResponseModel";
import { IBotsResource } from "../resources/IBotsResource";
import { Produces, Response, Consumes } from "typescript-rest-swagger";

@Path("/api/bots")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class BotsController {

    @Inject
    private botsService: BotsService;

    @Path("/")
    @GET
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200, "bot list")
    @Security("ROLE_USER", "Bearer")
    public async list(){
        return this.botsService.findAll();
    }

    @Path("/")
    @POST
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(201, "bot inserted")
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async insert(bot: IBotsResource){
        return this.botsService.saveOrUpdate(bot);
    }

    @Path("/:id")
    @DELETE
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200, "bot deleted")
    @Response<HttpResponseModel<IBotsResource>>(404, "bot not found")
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async delete(@PathParam("id")id: number){
        return this.botsService.deleteOne(id);
    }

    @Path("/")
    @PUT
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200, "bot updated")
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async update(bot : IBotsResource){
        return (this.botsService.update(bot));
    }

    @Path("/:id")
    @GET
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200, "bot details")
    @Response<HttpResponseModel<IBotsResource>>(404, "bot not found")
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async details(@PathParam("id") id: number){
        return (this.botsService.findOne(id));
    }

    @Path("/:botId/player/:playerId")
    @PUT
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200)
    @Response<HttpResponseModel<IBotsResource>>(404)
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async linkBotToPlayer(@PathParam("botId") botId: number,@PathParam("playerId") playerId: number){
        return (this.botsService.linkBotToPlayer(botId, playerId));
    }

    @Path("/:botId/stream/:streamId")
    @PUT
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200)
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async linkBotToStream(@PathParam("streamId") streamId: number, @PathParam("botId") botId: number){
        return (this.botsService.linkBotToStream(botId, streamId));
    }

    @Path("/user/:userId")
    @GET
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<Array<IBotsResource>>>(200)
    @Response<HttpResponseModel<Array<IBotsResource>>>(404)
    @Response<HttpResponseModel<Array<IBotsResource>>>(400)
    public async findByUser(@PathParam("userId") userId: number) {
        return (this.botsService.findByUser(userId));
    }
}
