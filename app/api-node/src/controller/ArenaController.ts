import { Path, POST, DELETE, PathParam, PUT, GET, PreProcessor, PostProcessor } from "typescript-rest";
import { ArenaService } from "../service/ArenaService";
import { IArenaResource } from "../resources/IArenaResource";
import { Container } from "typescript-ioc";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { ArenaResourceAsm } from "../resources/asm/ArenaResourceAsm";

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

    @Path("/")
    @GET
    public async list() : Promise<SendResource<HttpResponseModel<IArenaResource[]>>>
    {
        try {
            const list = await this.arenaService.findAll();
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
                response.message = "Error";
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

    @Path("/:id")
    @GET
    public async details(@PathParam("id") id: number){
        try {
            const arena = await this.arenaService.findOne(id);
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
}
