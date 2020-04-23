'use strict';

import { Path, POST, GET, PathParam, Security, ContextRequest, PreProcessor, PostProcessor, DELETE } from "typescript-rest";
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
import { AuthenticationService } from "../service/AuthenticationService";
import UserEntity from "../database/entities/UserEntity";
import { PlayerEntity } from "../database/entities/PlayerEntity";
import { PlayerService } from "../service/PlayerService";
import IGameProfileResource from "../resources/IGameProfileResource";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { UserResourceAsm } from "../resources/asm/UserResourceAsm";
import { GameProfileResourceAsm } from "../resources/asm/GameProfileResourceAsm";

@Path('/api/users')
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class UserController {
    private userService: UserService;
    private playerService: PlayerService;
    private authService: AuthenticationService;
    private userResourceAsm: UserResourceAsm;
    private gameProfileResourceAsm: GameProfileResourceAsm;

    constructor() {
        this.userService = Container.get(UserService);
        this.authService = Container.get(AuthenticationService);
        this.playerService = Container.get(PlayerService);
        this.userResourceAsm = Container.get(UserResourceAsm);
        this.gameProfileResourceAsm = Container.get(GameProfileResourceAsm);
    }

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<ITokenHttp>>(200, "User find")
    @Response<HttpResponseModel<ITokenHttp>>(404, "user not found")
    @Path('/login')
    @POST 
    public async loginRoute(user: IUserHttpModel): Promise<SendResource<HttpResponseModel<ITokenHttp>>> {
        try {
            const data = await this.authService.authenticate(user.username, user.password);

            if (data){
                const tokenHttp : ITokenHttp = {
                    data: data
                };
                const response : HttpResponseModel<ITokenHttp> = {
                    httpCode: 200,
                    data: tokenHttp,
                    message: "Authentication successfull"
                };

                return Promise.resolve(new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response));
            }
            else {
                const response : HttpResponseModel<ITokenHttp> = {
                    httpCode: 404,
                    data: null,
                    message: "User not found"
                };

                return Promise.resolve(new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response));
            }
        }
        catch (e){
            const response : HttpResponseModel<ITokenHttp> = {
                httpCode: 400,
                data: null,
                message: "Bad request"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response));
        }
    }

    @Produces("application/json;charset=UTF-8")
    @Consumes("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IResourceId>>(201, "User created")
    @Response<HttpResponseModel<IResourceId>>(409, "User already exist")
    @Response<HttpResponseModel<IResourceId>>(400)
    @Path('/')
    @POST
    public async register(user: IUserResource): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        const entity = this.userResourceAsm.toEntity(user);

        try {
            const savedUser = await this.userService.saveOrUpdate(entity);
            const resourceId: IResourceId = {
                id: savedUser.id
            };
            const response: HttpResponseModel<IResourceId> = {
                httpCode: 201,
                message: "User registerd",
                data: resourceId
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
        catch (e){
            console.log(e.message);
            const response: HttpResponseModel<IResourceId> = {
                httpCode: 409,
                data: null,
                message: "User already exist"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
    }

    @Path("/:id/player")
    @POST
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IResourceId>>(201, "Player created")
    @Response<HttpResponseModel<IResourceId>>(409, "Player already exist")
    @Response<HttpResponseModel<IResourceId>>(400)
    public async registerPlayer(player: IGameProfileResource, @PathParam("id") id: number): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        try {
            const entity = new PlayerEntity();

            entity.user = await this.userService.findOne(id);
            entity.total_points = player.total_points;
            entity.name = player.name;
            const finded = await this.playerService.search({
                where: [
                    {
                        name: entity.name
                    }
                ]
            });
            if (!finded){
                const response: HttpResponseModel<IResourceId> = {
                    data: null,
                    message: "Player already exist",
                    httpCode: 409
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            }
            const saved : PlayerEntity = await this.playerService.saveOrUpdate(entity);
            const response: HttpResponseModel<IResourceId> = {
                data: {
                    id: saved.id
                },
                message: "Player created",
                httpCode: 201
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IResourceId> = {
                data: null,
                message: "Bad request",
                httpCode: 400
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
    }

    @Path('/profile/:id')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "User find")
    @Response<HttpResponseModel<IUserResource>>(404, "Not found")
    @GET
    public async read(@PathParam("id") id: number): Promise<SendResource<HttpResponseModel<IUserResource>>> {
        try {
            const user : UserEntity = await this.userService.findOne(id);
            const notFound : HttpResponseModel<IUserResource> = {
                httpCode: 404,
                message: "User not found",
                data: null
            };
            if (!user){
                return Promise.resolve(new SendResource<HttpResponseModel<IUserResource>>("UserController", notFound.httpCode, notFound));
            }
            const resource: IUserResource = await  this.userResourceAsm.toResource(user);
            const response: HttpResponseModel<IUserResource> = {
                data: resource,
                httpCode: 200,
                message: "Profile user"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IUserResource>>("UserController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IUserResource> = {
                data: null,
                httpCode: 400,
                message: "Error user"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IUserResource>>("UserController", response.httpCode, response));
        }
    }


    @Path("/profile")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource>>(200, "User find")
    @Response<HttpResponseModel<IUserResource>>(404, "User not found")
    @GET
    public async profile(@ContextRequest req: Request): Promise<SendResource<HttpResponseModel<IUserResource>>> {
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
        try {
            let users = await this.userService.findAll();
            if (!users){
                users = [];
            }
            const resources : IUserResource[] = await this.userResourceAsm.toResources(users);
            const response: HttpResponseModel<IUserResource[]> = {
                httpCode: 200,
                message: "User list",
                data: resources
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IUserResource[]>>("UserController", response.httpCode, response)));
        } catch (e){
            const response: HttpResponseModel<IUserResource[]> = {
                httpCode: 400,
                message: "Bad request",
                data: null
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IUserResource[]>>("UserController", response.httpCode, response)));
        }
    }

    @Path('/:userId/players')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "User list")
    @Response<HttpResponseModel<IUserResource[]>>(400)
    @GET
    public async players(@PathParam("userId")userId: number): Promise<SendResource<HttpResponseModel<IGameProfileResource[]>>> {
        try {
            const user = await this.userService.findOne(userId);
            const players = await this.playerService.search({
                where: [
                    {
                        user: user
                    }
                ]
            });
            const resources : IGameProfileResource[] = await this.gameProfileResourceAsm.toResources(players);
            const response: HttpResponseModel<IGameProfileResource[]> = {
                httpCode: 200,
                message: "User list",
                data: resources
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
        } catch (e){
            const response: HttpResponseModel<IGameProfileResource[]> = {
                httpCode: 400,
                message: "Bad request",
                data: null
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
        }
    }

    @Path('/player/:playerId')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "Player deleted")
    @Response<HttpResponseModel<IUserResource[]>>(404, "Player not found")
    @Response<HttpResponseModel<IUserResource[]>>(400)
    @DELETE
    public async deletePlayer(@PathParam("playerId")playerId:  number){
        try {
            const flag = await this.playerService.deleteOne(playerId);

            if (flag){
                const response: HttpResponseModel<IGameProfileResource[]> = {
                    httpCode: 200,
                    message: "Player deleted"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
            }
            else{
                const response: HttpResponseModel<IGameProfileResource[]> = {
                    httpCode: 404,
                    message: "Player not found"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
            }
        }
        catch (e){
            const response: HttpResponseModel<IGameProfileResource[]> = {
                httpCode: 400,
                message: "Bad request",
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
        }
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
        try {
            const flag = await this.userService.deleteOne(userId);

            if (flag){
                const response: HttpResponseModel<IGameProfileResource[]> = {
                    httpCode: 200,
                    message: "User deleted"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
            }
            else {
                const response: HttpResponseModel<IGameProfileResource[]> = {
                    httpCode: 404,
                    message: "User not found"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
            }
        } catch (e){
            const response: HttpResponseModel<IGameProfileResource[]> = {
                httpCode: 400,
                message: "Bad request",
                data: null
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
        }
    }
}
