'use strict';

import { Path, POST, GET, PathParam, Security, ContextRequest } from "typescript-rest";
import IUserResource from "../resources/IUserResource";
import IUserHttpModel from "../resources/IUserHttpModel";
import IResourceId from "../resources/IResourceId";
import ITokenHttp from "../resources/ITokenHttp";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import * as _ from "lodash";
import { Container } from "typescript-ioc";
import { Request } from "express-serve-static-core";
import { Consumes, Produces, Response } from "typescript-rest-swagger";
import { UserService } from "../service/UserService";

@Path('/users')
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = Container.get(UserService);
    }

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<ITokenHttp>>(200, "User find")
    @Response<HttpResponseModel<ITokenHttp>>(404, "user not found")
    @Path('/login')
    @POST 
    public async loginRoute(user: IUserHttpModel): Promise<SendResource<HttpResponseModel<ITokenHttp>>> {
        try {
            return await this.userService.login(user);
        } catch (e){
            const response: HttpResponseModel<ITokenHttp> = {
                data: null,
                message: "internal error",
                httpCode: 500
            };

            return (new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response));
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("applicaiton/json;charset=UTF-8")
    @Response<HttpResponseModel<IResourceId>>(201, "User created")
    @Response<HttpResponseModel<IResourceId>>(409, "User already exist")
    @Response<HttpResponseModel<IResourceId>>(400)
    @Path('/')
    @POST
    public async register(user: IUserResource): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        try {
            return await this.userService.register(user);
        } catch (e){
            const response: HttpResponseModel<IResourceId> = {
                data: null,
                message: "internal error",
                httpCode: 500
            };

            return (new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));        
        }
    }

    @Path('/profile/:id')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "User find")
    @GET
    public async read(@PathParam("id") id: number): Promise<SendResource<HttpResponseModel<IUserResource>>> {
        try {
            return await this.userService.profile(id);
        } catch (e){
            const response: HttpResponseModel<IUserResource> = {
                data: null,
                message: "internal error",
                httpCode: 500
            };

            return (new SendResource<HttpResponseModel<IUserResource>>("UserController", response.httpCode, response));        }
    }


    @Path("/profile")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "Profile user")
    @Response<HttpResponseModel<IUserResource>>(500, "Internal error")
    @GET
    public async profile(@ContextRequest req: Request): Promise<SendResource<HttpResponseModel<IUserResource>>> {
        try {
            return await this.userService.profile(req.user.id);
        } catch (e) {
            const response: HttpResponseModel<IUserResource> = {
                data: null,
                message: "internal error",
                httpCode: 500
            };

            return (new SendResource<HttpResponseModel<IUserResource>>("UserController", response.httpCode, response));        }
    }

    @Path('/')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "list user")
    @GET
    public async list(): Promise<SendResource<HttpResponseModel<IUserResource[]>>> {
        try {
            return await this.userService.list();
        } catch (e){
            const response: HttpResponseModel<IUserResource[]> = {
                data: null,
                message: "internal error",
                httpCode: 500
            };

            return (new SendResource<HttpResponseModel<IUserResource[]>>("UserController", response.httpCode, response));        
        }
    }
}
