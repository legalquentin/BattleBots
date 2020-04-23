import { GameService } from "../service/GameService";
import { Container } from "typescript-ioc";
import { Path, PreProcessor, PostProcessor, POST, PUT, PathParam, GET, DELETE, Security  } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { IGameResource } from "../resources/IGameResource";
import { GameResourceAsm } from "../resources/asm/GameResourceAsm";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import { GameEntity } from "../database/entities/GameEntity";
import { Produces, Response, Consumes } from "typescript-rest-swagger";

@Path("/api/games")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class GameController {
    private gameService: GameService;
    private gameResourceAsm: GameResourceAsm;

    constructor(){
        this.gameService = Container.get(GameService);
        this.gameResourceAsm = Container.get(GameResourceAsm);
    }

    @PUT
    @Path("/start/:id")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game started")
    @Response<HttpResponseModel<IGameResource>>(404, "game not found")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async start(@PathParam("id")id: number){
        try {
            const entity: GameEntity = await  this.gameService.start(id);

            if (!entity){
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: 404,
                    message: "game not found",
                };
        
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
            }
            const resource = await this.gameResourceAsm.toResource(entity);
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: "game started",
                data: resource
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    @PUT
    @Path("/stop/:id")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game stopped")
    @Response<HttpResponseModel<IGameResource>>(404, "game not found")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async stop(@PathParam("id")id: number){
        try {
            const entity: GameEntity = await  this.gameService.stop(id);

            if (!entity){
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: 404,
                    message: "game not found",
                };
        
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
            }
            const resource = await this.gameResourceAsm.toResource(entity);
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: "game stopped",
                data: resource
            }; 
            
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
    
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    @POST
    @Path("/create")
    @Security("ROLE_USER", "Bearer")
    @Consumes("appplication/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(201, "game created")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async create(game: IGameResource){
        try {
            const entity = await this.gameResourceAsm.toEntity(game);
            const saved = await this.gameService.create(entity);
            console.log(saved);
            const resource = await this.gameResourceAsm.toResource(saved);
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 201,
                message: "game created",
                data: resource
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            console.log(e.message);
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    @PUT
    @Path("/end/:id")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game ended")
    @Response<HttpResponseModel<IGameResource>>(404, "game not found")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async end(@PathParam("id")id: number){
        try {
            const entity: GameEntity = await this.gameService.end(id);

            if (!entity){
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: 404,
                    message: "game not found",
                };
        
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
            }
            const resource = await this.gameResourceAsm.toResource(entity);
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: "game ended",
                data: resource
            }; 
            
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
    
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    @GET
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game list")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async list(){
        try {
            const list = await this.gameService.findAll();
            const resources = await this.gameResourceAsm.toResources(list);
            const response : HttpResponseModel<Array<IGameResource>> = {
                httpCode: 200,
                message: "game list",
                data: resources
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<Array<IGameResource>>>("GameController", response.httpCode, response));        
        }
        catch (e){
            const response: HttpResponseModel<Array<IGameResource>> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<Array<IGameResource>>>("GameController", response.httpCode, response));
        }
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
        try {
            const flag = await this.gameService.deleteOne(id);

            if (flag){
                const response: HttpResponseModel<IGameResource> = {
                    message: "game deleted",
                    httpCode: 200
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
            }
            else {
                const response: HttpResponseModel<IGameResource> = {
                    message: "game not found",
                    httpCode: 404
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
            }
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                message: e.message,
                httpCode: 400
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    @PUT
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200, "game updated")
    @Response<HttpResponseModel<IGameResource>>(400)
    public async update(game: IGameResource){
        try {
            const entity = await this.gameResourceAsm.toEntity(game);
            const updated = await this.gameService.saveOrUpdate(entity);
            const resource = await this.gameResourceAsm.toResource(updated);
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: "game updated",
                data: resource
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response)));
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    @PUT
    @Path("/:gameId/bot/:botId")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json; charset=UTF-8")
    @Produces("application/json; charset=UTF-8")
    @Response<HttpResponseModel<IGameResource>>(200)
    @Response<HttpResponseModel<IGameResource>>(400)
    public async linkBotToGame(@PathParam("botId") botId: number, @PathParam("gameId")gameId: number){
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
        return (await this.gameService.linkArenaToGame(arenaId, gameId));
    }
}