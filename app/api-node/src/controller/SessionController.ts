import { PreProcessor, PostProcessor, Path, Security, GET, PathParam, POST, PUT, DELETE } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { IContextBotResource } from "../resources/IContextBotResource";
import { SessionService } from "../service/SessionService";
import { Inject } from "typescript-ioc";
import { Produces, Response } from "typescript-rest-swagger";
import HttpResponseModel from "../resources/HttpResponseModel";

@Path("/api/sessions")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class SessionController {

    @Inject
    sessionService: SessionService;

    @POST
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IContextBotResource>>(200, "session save")
    @Response<HttpResponseModel<IContextBotResource>>(400)
    public async insert(session: IContextBotResource){
        return (await this.sessionService.save(session));
    }

    @GET
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IContextBotResource[]>>(200, "session list")
    @Response<HttpResponseModel<IContextBotResource[]>>(400)
    public async list(){
        return (await this.sessionService.list());
    }

    @GET
    @Path("/:id")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IContextBotResource>>(200, "game list")
    @Response<HttpResponseModel<IContextBotResource>>(400)
    public async getOne(@PathParam("id") id: number){
        return (await this.sessionService.findOne(id));
    }

    @PUT
    @Path("/")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IContextBotResource>>(200, "session save")
    @Response<HttpResponseModel<IContextBotResource>>(400)
    public async update(session: IContextBotResource){
        return (await this.sessionService.update(session));
    }

    @DELETE
    @Path("/:id")
    @Security("ROLE_USER", "Bearer")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IContextBotResource>>(200, "session save")
    @Response<HttpResponseModel<IContextBotResource>>(400)
    public async deleteOne(@PathParam("id") id: number){
        return (await this.sessionService.delete(id));
    }

}