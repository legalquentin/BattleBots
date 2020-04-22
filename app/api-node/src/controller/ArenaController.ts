import { Path, POST, DELETE, PathParam, PUT, GET, PreProcessor, PostProcessor, Security } from "typescript-rest";
import { ArenaService } from "../service/ArenaService";
import { IArenaResource } from "../resources/IArenaResource";
import { Container } from "typescript-ioc";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { ArenaResourceAsm } from "../resources/asm/ArenaResourceAsm";
import { Produces, Consumes, Response } from "typescript-rest-swagger";
import { EEntityStatus } from "../../lib/EEntityStatus";

@Path("/api/arena")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class ArenaController {
    private arenaService: ArenaService;
    private arenaResourceAsm: ArenaResourceAsm;

    constructor(){
        this.arenaService = Container.get(ArenaService);
        this.arenaResourceAsm = Container.get(ArenaResourceAsm);
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
        const toSave = await this.arenaResourceAsm.toEntity(arena);
        try {
            const saved = await this.arenaService.saveOrUpdate(toSave);
            const resource = await this.arenaResourceAsm.toResource(saved);
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 201,
                message: "Arena inserted",
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));       
        }
        catch (e){
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource[]>>(200, "Arena list")
    @Response<HttpResponseModel<IArenaResource[]>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/")
    @GET
    public async list() : Promise<SendResource<HttpResponseModel<IArenaResource[]>>>
    {
        try {
            const list = await this.arenaService.findAll();
            console.log(list);
            const resources = await this.arenaResourceAsm.toResources(list);
            const response : HttpResponseModel<IArenaResource[]> = {
                httpCode: 200,
                message: "Arena list",
                data: resources
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource[]>>("ArenaController", response.httpCode, response));       
        }
        catch (e){
            const response : HttpResponseModel<IArenaResource[]> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource[]>>("ArenaController", response.httpCode, response));        
        }
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
        try {
            const isDeleted = await this.arenaService.deleteOne(id);
            const response : HttpResponseModel<IArenaResource> = {};

            if (isDeleted)
            {
                response.httpCode = 200;
                response.message = "Arena deleted";
            }
            else
            {
                response.message = "Arena not found";
                response.httpCode = 404;
            }
            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));       
        }
        catch (e){
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
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
        const entity = await this.arenaResourceAsm.toEntity(arena);
         try {
            const updated = await this.arenaService.saveOrUpdate(entity);
            const resource = await this.arenaResourceAsm.toResource(updated);
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                message: "Arena updated",
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));       
        }
        catch (e){
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(200, "Arena disable")
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/:id/disable")
    @PUT
    public async disable(@PathParam("id") id: number)
    {
        try {
            await this.arenaService.disable(id);
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                message: "Arena disable"
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }
        catch (e) {
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(200, "Arena details")
    @Response<HttpResponseModel<IArenaResource>>(404, "Arena not found")
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/:id")
    @GET
    public async details(@PathParam("id") id: number){
        try {
            const arena = await this.arenaService.findOne(id);
            console.log(arena);
            console.log(await arena.robotArena);
            console.log(arena.robotArena);
            if (!arena){
                const response: HttpResponseModel<IArenaResource> = {
                    httpCode: 404,
                    message: "Arena not found",
                };
    
                return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
            }
            const resource = await this.arenaResourceAsm.toResource(arena);
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                message: "Arena details",
                data: resource
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }
        catch (e) {
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IArenaResource>>(200, "Arena enable")
    @Response<HttpResponseModel<IArenaResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @Path("/:id/enable")
    @PUT
    public async enable(@PathParam("id") id: number)
    {
        try {
            await this.arenaService.enable(id);
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                message: "Arena enable"
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }
        catch (e) {
            const response : HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response));        
        }
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
        try {
            const arena = await this.arenaService.linkBot(arenaId, botId);
            const resource = await this.arenaResourceAsm.toResource(arena);
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                data: resource,
                message: `link bot ${botId} to arena ${arenaId}`
            };
            
            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }   
        catch (e){
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };
            
            if (e.code == EEntityStatus.NOT_FOUND){
                response.httpCode = 404;
            }
            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }
    }
}
