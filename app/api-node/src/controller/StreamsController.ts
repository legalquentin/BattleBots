import { StreamsService } from "../service/StreamsService";
import { Inject } from "typescript-ioc";
import { Path, PreProcessor, PostProcessor, PathParam, GET, DELETE, POST, PUT, Security  } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import HttpResponseModel from "../resources/HttpResponseModel";
import { IStreamResource } from "../resources/IStreamResource";
import { Produces, Consumes, Response } from "typescript-rest-swagger";

@Path("/api/streams")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class StreamsContoller {
    
    @Inject
    private streamsService: StreamsService;

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "Stream list")
    @Security("ROLE_USER", "Bearer")
    @Path("/")
    @GET
    public async list(){
        return this.streamsService.findAll();
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(201, "Stream inserted")
    @Response<HttpResponseModel<IStreamResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @POST
    @Path("/")
    public async insert(stream: IStreamResource){
        return this.streamsService.saveOrUpdate(stream);
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "Stream deleted")
    @Response<HttpResponseModel<IStreamResource>>(404, "Stream not found")
    @Response<HttpResponseModel<IStreamResource>>(400, "error")
    @Security("ROLE_USER", "Bearer")
    @DELETE
    @Path("/:id")
    public async delete(@PathParam("id")id: number){
        return (this.streamsService.deleteOne(id));
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "stream updated")
    @Response<HttpResponseModel<IStreamResource>>(400)
    @Security("ROLE_USER", "Bearer")
    @PUT
    @Path("/")
    public async update(streamResource: IStreamResource){
        return (this.streamsService.saveOrUpdate(streamResource));
    }

    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IStreamResource>>(200, "Stream finded")
    @Response<HttpResponseModel<IStreamResource>>(404, "Stream not found")
    @Security("ROLE_USER", "Bearer")
    @GET
    @Path("/:id")
    public async detail(@PathParam("id")id: number){
        return (this.streamsService.getOne(id));
    }
}