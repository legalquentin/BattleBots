'use strict';

import { Path, POST, GET, PathParam, Security, ContextRequest } from "typescript-rest";
import IUserResource from "../resources/IUserResource";
import IUserHttpModel from "../resources/IUserHttpModel";
import UserAsm from "../resources/asm/UserAsm";
import UserEntity from "../database/entities/UserEntity";
import IResourceId from "../resources/IResourceId";
import { encode } from "jwt-simple";
import { compare } from "bcrypt";
import Config from "../service/impl/Config";
import ITokenHttp from "../resources/ITokenHttp";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import { userResourceDecoder } from "../validation/Validation";
import { PlayerEntity } from "../database/entities/PlayerEntity";
import * as _ from "lodash";
import { Container } from "typescript-ioc";
import { UserRepository } from "../database/repositories/UserRepository";
import { PlayerRepository } from "../database/repositories/PlayerRepository";
import { Request } from "express-serve-static-core";
import { Consumes, Produces, Response } from "typescript-rest-swagger";

@Path('/users')
export class UserController {

    repository: UserRepository;
    playerRepository: PlayerRepository;
    config: Config;
    userAsm: UserAsm;

    constructor() {
        this.repository = Container.get(UserRepository);
        this.playerRepository = Container.get(PlayerRepository);
        this.config = Container.get(Config);
        this.userAsm = Container.get(UserAsm);
    }

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<ITokenHttp>>(200, "User find")
    @Response<HttpResponseModel<ITokenHttp>>(404, "user not found")
    @Path('/login')
    @POST 
    public loginRoute(user: IUserHttpModel) {
        return new Promise<SendResource<HttpResponseModel<ITokenHttp>>>(async (end) => {
            let users = await this.repository.find({ where: [{ pseudo: user.username }, { email: user.username }] });
            if (!users) {
                users = [];
            }
            for (let player of users) {
                if (await compare(user.password, player.hash)) {
                    const payload: any = {};
                    payload.sub = player.id;
                    payload.role = "ROLE_USER";
                    const data = encode(payload, this.config.getSecret());
                    const token: ITokenHttp = {
                        data: data
                    };
                    const response: HttpResponseModel<ITokenHttp> = {
                        message: "User find",
                        httpCode: 200,
                        data: token
                    };
                    end(new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response));
                    return;
                }
            }
            const response: HttpResponseModel<ITokenHttp> = {
                data: null,
                message: "user not found",
                httpCode: 404
            };
            end(new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response));
        });
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("applicaiton/json;charset=UTF-8")
    @Response<HttpResponseModel<IResourceId>>(201, "User created")
    @Response<HttpResponseModel<IResourceId>>(409, "User already exist")
    @Response<HttpResponseModel<IResourceId>>(400)
    @Path('/')
    @POST
    public register(user: IUserResource): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        const entity = this.userAsm.toEntity(user);

        return new Promise<SendResource<HttpResponseModel<IResourceId>>>(async (end) => {
            const idResource: IResourceId = {
                id: -1
            };
            let ret: UserEntity = null;
            const response: HttpResponseModel<IResourceId> = {
                data: idResource,
                httpCode: 400,
                message: "User created"
            };

            if (_.trim(user.password).length === 0) {
                response.message = "password cannot be null";
                return end(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            } else if (_.trim(user.pseudo).length === 0 || _.trim(user.email).length === 0) {
                response.message = "fields cannot be null";
                return end(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            }
            try {
                userResourceDecoder.runWithException(user);
            }
            catch (e) {
                response.message = e.message;
                return end(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            }
            if (user.password !== user.confirmation) {
                response.message = "Password doesn't match confirmation field";
                return end(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            }
            let list = await this.repository.find({ where: { pseudo: entity.pseudo } });
            if (!list) {
                list = [];
            }
            if (list.length === 0) {
                try {
                    ret = await this.repository.save(entity);
                    const player: PlayerEntity = {
                        user: ret,
                        total_points: 0
                    };
                    await this.playerRepository.save(player);
                    response.httpCode = 201;
                }
                catch (e) {
                    response.message = "Failed to save user";
                }
            }
            else {
                response.message = "User already exist";
                response.httpCode = 409;
            }
            if (idResource && ret) {
                idResource.id = ret.id;
            }
            end(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        });
    }

    @Path('/profile/:id')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "User find")
    @GET
    public read(@PathParam("id") id: number): Promise<SendResource<HttpResponseModel<IUserResource>>> {
        return new Promise<SendResource<HttpResponseModel<IUserResource>>>(async end => {
            const entity = await this.playerRepository.findOne(id);
            const resource = this.userAsm.toPlayerResource(entity);
            const response: HttpResponseModel<IUserResource> = {
                httpCode: 200,
                message: "User find",
                data: resource
            };

            end(new SendResource<HttpResponseModel<IUserResource>>("UserController", response.httpCode, response));
        });
    }


    @Path("/profile")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "Profile user")
    @Response<HttpResponseModel<IUserResource>>(500, "Internal error")
    @GET
    public profile(@ContextRequest req: Request): Promise<SendResource<HttpResponseModel<IUserResource>>> {
        return new Promise<SendResource<HttpResponseModel<IUserResource>>>(async (end) => {
            const user = await this.playerRepository.findOne(req.user.id);
            const response: HttpResponseModel<IUserResource> = {
                httpCode: 200,
                message: "Profile user",
            };

            if (!user) {
                response.httpCode = 500;
                response.message = "Internal error";
            }
            else {
                response.data = this.userAsm.toPlayerResource(user);
            }
            end(new SendResource<HttpResponseModel<IUserResource>>("UserController", response.httpCode, response));
        });
    }

    @Path('/')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "list user")
    @GET
    public list(): Promise<SendResource<HttpResponseModel<IUserResource[]>>> {
        return new Promise<SendResource<HttpResponseModel<IUserResource[]>>>(async (end) => {
            const list = await this.playerRepository.find();
            const response: HttpResponseModel<IUserResource[]> = {
                httpCode: 200,
                message: "list user",
                data: this.userAsm.toPlayerResources(list)
            };

            end(new SendResource<HttpResponseModel<IUserResource[]>>("UserController", response.httpCode, response));
        });
    }
}
