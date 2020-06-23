'use strict';

import { Path, POST, GET, PathParam, Security, ContextRequest, PreProcessor, PostProcessor, DELETE, PUT } from "typescript-rest";
import IUserResource from "../resources/IUserResource";
import IUserHttpModel from "../resources/IUserHttpModel";
import IResourceId from "../resources/IResourceId";
import ITokenHttp from "../resources/ITokenHttp";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import * as _ from "lodash";
import { Inject } from "typescript-ioc";
import { Consumes, Produces, Response } from "typescript-rest-swagger";
import { UserService } from "../service/UserService";
import { AuthenticationService } from "../service/AuthenticationService";
//import { PlayerService } from "../service/PlayerService";
import IGameProfileResource from "../resources/IGameProfileResource";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { ConnectedUserService } from "../service/ConnectedUserService";
import * as express from "express";
import IConfig from "../service/IConfig";

@Path('/api/users')
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class UserController {

    @Inject
    private userService: UserService;

    @Inject
    private connectedUsers: ConnectedUserService;

    @Inject
    private authService: AuthenticationService;

    @Inject
    private config: IConfig;

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<ITokenHttp>>(200, "User find")
    @Response<HttpResponseModel<ITokenHttp>>(404, "user not found")
    @Path('/login')
    @POST 
    public async loginRoute(user: IUserHttpModel, req: express.Request): Promise<SendResource<HttpResponseModel<ITokenHttp>>> {
        if (this.config.getLocalAddress() !== req.socket.remoteAddress){
            await this.linkPosition(req);
        }
        return this.authService.authenticate(user.username, user.password);
    }

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<ITokenHttp>>(200, "User find")
    @Response<HttpResponseModel<ITokenHttp>>(404, "user not found")
    @Path('/login/up')
    @POST 
    public async loginUp(token: ITokenHttp, req: express.Request): Promise<SendResource<HttpResponseModel<ITokenHttp>>> {
        if (this.config.getLocalAddress() !== req.socket.remoteAddress){
            await this.linkPosition(req);
        }
        return this.authService.refresh(token.data);
    }

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Security("ROLE_USER", "Bearer")
    @Response<HttpResponseModel<ITokenHttp>>(200, "logout user")
    @Path('/logout')
    @POST 
    public async logout(@ContextRequest req: Express.Request): Promise<SendResource<HttpResponseModel<ITokenHttp>>> {
        return this.authService.logout(req.user.id);
    }

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Security("ROLE_USER", "Bearer")
    @Response<HttpResponseModel<ITokenHttp>>(200, "position updated")
    @Response<HttpResponseModel<ITokenHttp>>(400, "request from localhost")
    @Path('/update-position/users')
    @PUT
    public async linkPosition(@ContextRequest req: express.Request){
        return (this.connectedUsers.linkPosition(req.user.id, req.socket.remoteAddress));
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IResourceId>>(201, "User created")
    @Response<HttpResponseModel<IResourceId>>(409, "User already exist")
    @Response<HttpResponseModel<IResourceId>>(400)
    @Path('/')
    @POST
    public async register(user: IUserResource): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        return this.userService.saveOrUpdate(user);
    }

    @Path('/profile/:id')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "User find")
    @Response<HttpResponseModel<IUserResource>>(404, "Not found")
    @GET
    public async read(@PathParam("id") id: number): Promise<SendResource<HttpResponseModel<IUserResource>>> {
        return this.userService.findOne(id);
    }


    @Path("/profile")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "User find")
    @Response<HttpResponseModel<IUserResource>>(404, "User not found")
    @GET
    public async profile(@ContextRequest req): Promise<SendResource<HttpResponseModel<IUserResource>>> {
        return (this.read(req.user.id));
    }

    @Path('/')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "User list")
    @Response<HttpResponseModel<IUserResource[]>>(400, "Bad request")
    @GET
    public async list(): Promise<SendResource<HttpResponseModel<IUserResource[]>>> {
        return this.userService.findAll();
    }

    @Path('/connected/users')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "Get connected users")
    @Response<HttpResponseModel<IUserResource[]>>(400, "Bad request")
    @GET
    public async getConnectedUsers(): Promise<SendResource<HttpResponseModel<IUserResource[]>>> {
        return (this.connectedUsers.getConnected());
    }

    public trackCurrentPosition(){

    }

    public trackAllPositions(){

    }

    @Path('/:userId')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "User deleted")
    @Response<HttpResponseModel<IUserResource[]>>(404, "User not found")
    @Response<HttpResponseModel<IUserResource[]>>(400)
    @DELETE
    public async deleteUser(@PathParam("userId")userId: number): Promise<SendResource<HttpResponseModel<IGameProfileResource[]>>> {
        return this.userService.deleteOne(userId);
    }

}
