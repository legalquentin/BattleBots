import { StreamsService } from "../service/StreamsService";
import { Container } from "typescript-ioc";
import { Path, PreProcessor, PostProcessor, PathParam, GET, DELETE, POST, PUT, Security  } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import HttpResponseModel from "../resources/HttpResponseModel";
import { IStreamResource } from "../resources/IStreamResource";
import { StreamsResourceAsm } from "../resources/asm/StreamsResourceAsm";
import { SendResource } from "../../lib/ReturnExtended";
import { Produces, Consumes, Response } from "typescript-rest-swagger";

@Path("/api/streams")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class StreamsContoller {
    private streamsService: StreamsService;
    private streamResourceAsm: StreamsResourceAsm;

    constructor(){
        this.streamsService = Container.get(StreamsService);
        this.streamResourceAsm  = Container.get(StreamsResourceAsm);
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "Stream list")
    @Security("ROLE_USER", "Bearer")
    @Path("/")
    @GET
    public async list(){
        const list = await this.streamsService.findAll();
        const resources = await this.streamResourceAsm.toResources(list);
        const response: HttpResponseModel<Array<IStreamResource>> = {
            data: resources,
            httpCode: 200,
            message: "Stream list"
        };

        return Promise.resolve(new SendResource<HttpResponseModel<Array<IStreamResource>>>("StreamController", response.httpCode, response));
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(201, "Stream inserted")
    @Response<HttpResponseModel<IStreamResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @POST
    @Path("/")
    public async insert(stream: IStreamResource){
        const entity = await this.streamResourceAsm.toEntity(stream);

        try {
            const finded = await this.streamsService.saveOrUpdate(entity);
            const resource = await this.streamResourceAsm.toResource(finded);
            const response: HttpResponseModel<IStreamResource> = {
                data: resource,
                httpCode: 201,
                message: "Stream inserted"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "Stream deleted")
    @Response<HttpResponseModel<IStreamResource>>(404, "Stream not found")
    @Response<HttpResponseModel<IStreamResource>>(400, "error")
    @Security("ROLE_USER", "Bearer")
    @DELETE
    @Path("/:id")
    public async delete(@PathParam("id")id: number){
        try {
            const flag = await this.streamsService.deleteOne(id);

            if (flag){
                const response: HttpResponseModel<IStreamResource> = {
                    httpCode: 200,
                    message: "Stream deleted"
                };
    
                return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
            }
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 404,
                message: "Stream not found"
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));    
        }
        catch (e){
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 400,
                message: "error"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));    
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "stream updated")
    @Response<HttpResponseModel<IStreamResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @PUT
    @Path("/")
    public async update(streamResource: IStreamResource){
        try {
            const entity = await this.streamResourceAsm.toEntity(streamResource);
            const updated = await this.streamsService.saveOrUpdate(entity);
            const resource = await this.streamResourceAsm.toResource(updated);
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 200,
                message: "stream updated",
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 400,
                message: e.message,
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "Stream finded")
    @Response<HttpResponseModel<IStreamResource>>(404, "Stream not found")
    @Security("ROLE_USER", "Bearer")
    @GET
    @Path("/:id")
    public async detail(@PathParam("id")id: number){
        const stream = await this.streamsService.findOne(id);
        const resource = await this.streamResourceAsm.toResource(stream);
         if (resource){
            const response: HttpResponseModel<IStreamResource> = {
                httpCode: 200,
                message: "Stream finded",
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
        }
        const response: HttpResponseModel<IStreamResource> = {
            httpCode: 404,
            message: "Stream not found"   
        };
        return Promise.resolve(new SendResource<HttpResponseModel<IStreamResource>>("StreamController", response.httpCode, response));
    }
}