import { Path, PreProcessor, PostProcessor, GET, POST, PathParam, DELETE, PUT, Security  } from "typescript-rest";
import { BotsService } from "../service/BotsService";
import { Container } from "typescript-ioc";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import { IBotsResource } from "../resources/IBotsResource";
import { BotResourceAsm } from "../resources/asm/BotResourceAsm";
import { Produces, Response, Consumes } from "typescript-rest-swagger";

@Path("/api/bots")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class BotsController {
    private botsService: BotsService;
    private botResourceAsm: BotResourceAsm;

    constructor(){
        this.botsService = Container.get(BotsService);
        this.botResourceAsm = Container.get(BotResourceAsm);
    }

    @Path("/")
    @GET
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200, "bot list")
    @Security("ROLE_USER", "Bearer")
    public async list(){
        const robots = await this.botsService.findAll();
        const resources = await this.botResourceAsm.toResources(robots);
        const response= {
            httpCode: 200,
            message: "bot list",
            data: resources
        };

        return Promise.resolve(new SendResource<HttpResponseModel<Array<IBotsResource>>>("BotController", response.httpCode, response));
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
        try {
            const flag = await this.botsService.deleteOne(id);

            if (!flag){
                const response: HttpResponseModel<IBotsResource> = {
                    httpCode: 404,
                    message: "bot not found"
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
            }
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 200,
                message: "bot deleted"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
        catch(e){
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 400,
                message: "internal error"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
    }

    @Path("/")
    @PUT
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200, "bot updated")
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async update(bot : IBotsResource){
        const entity = await this.botResourceAsm.toEntity(bot);

        console.log(entity);
        try {
            const updated = await this.botsService.__saveOrUpdate(entity);
            const resource = await this.botResourceAsm.toResource(updated);
            const response : HttpResponseModel<IBotsResource> = {
                httpCode: 200,
                data: resource,
                message: "bot updated"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
        catch (e){
            console.log(e.message);
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 400,
                message: "error"
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotsController", response.httpCode, response)));
        }
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
        return (await this.botsService.findOne(id));
    }

    @Path("/:botId/player/:playerId")
    @PUT
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200)
    @Response<HttpResponseModel<IBotsResource>>(404)
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async linkBotToPlayer(@PathParam("botId") botId: number,@PathParam("playerId") playerId: number){
        return (await this.botsService.linkBotToPlayer(botId, playerId));
    }

    @Path("/:botId/stream/:streamId")
    @PUT
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IBotsResource>>(200)
    @Response<HttpResponseModel<IBotsResource>>(400)
    public async linkBotToStream(@PathParam("streamId") streamId: number, @PathParam("botId") botId: number){
        return (await this.botsService.linkBotToStream(botId, streamId));
    }

    @Path("/user/:userId")
    @GET
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<Array<IBotsResource>>>(200)
    @Response<HttpResponseModel<Array<IBotsResource>>>(404)
    @Response<HttpResponseModel<Array<IBotsResource>>>(400)
    public async findByUser(@PathParam("userId") userId: number) {
        return (await this.botsService.findByUser(userId));
    }
}
