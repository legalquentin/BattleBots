import { GameService } from "../service/GameService";
import { Inject } from "typescript-ioc";
import { Path, PreProcessor, PostProcessor, POST, PUT, PathParam, GET, DELETE, Security  } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { IGameResource } from "../resources/IGameResource";
import HttpResponseModel from "../resources/HttpResponseModel";
import { Produces, Response, Consumes } from "typescript-rest-swagger";

@Path("/api/games")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class GameController {

    @Inject
    private gameService: GameService;

    @POST
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "create game")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async insert(resource: IGameResource){
        return this.gameService.saveOrUpdate(resource);
    }


    @GET
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game list")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async list(){
        return (this.gameService.findAll());
    }

    @GET
    @Path("/:id")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game detail")
    @Response<HttpResponseModel<IGameResource>>(404, "game not found")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async detail(@PathParam("id")id: number){
        return (this.gameService.findOne(id));
    }

    @DELETE
    @Path("/:id")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game deleted")
    @Response<HttpResponseModel<IGameResource>>(404, "game not found")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async delete(@PathParam("id")id: number){
        return this.gameService.deleteOne(id);
    }

    @PUT
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game updated")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async update(game: IGameResource){
        return (this.gameService.saveOrUpdate(game));
    }

    @PUT
    @Path("/:gameId/bot/:botId")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200)
    @Response<HttpResponseModel<IGameResource>>(400)
    public async linkBotToGame(@PathParam("botId") botId: number, @PathParam("gameId") gameId: number){
        return (this.gameService.linkBotToGame(botId, gameId));
    }

    @PUT
    @Path("/:gameId/stream/:streamId")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200)
    @Response<HttpResponseModel<IGameResource>>(400)
    public async linkStreamToGame(@PathParam("gameId") gameId: number,@PathParam("streamId") streamId: number){
        return (this.gameService.linkStreamToGame(streamId, gameId));
    }

    @PUT
    @Path("/:gameId/arena/:arenaId")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200)
    @Response<HttpResponseModel<IGameResource>>(400)
    public async linkArenaToGame(@PathParam("arenaId") arenaId: number, @PathParam("gameId") gameId: number){
        return ( this.gameService.linkArenaToGame(arenaId, gameId));
    }


    @PUT
    @Path("/join/:gameId")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200)
    @Response<HttpResponseModel<IGameResource>>(400)
    public async joinGame(@PathParam("gameId") gameId: string){
        return (this.gameService.joinGame(gameId));
    }
}