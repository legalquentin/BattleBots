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
import { AuthenticationService } from "../service/AuthenticationService";
import UserEntity from "../database/entities/UserEntity";
import { PlayerEntity } from "../database/entities/PlayerEntity";
import { PlayerService } from "../service/PlayerService";
import { IPlayerResource } from "../resources/IPlayerResource";
import IGameProfileResource from "../resources/IGameProfileResource";
import IConfig from "../service/IConfig";
import { hashSync } from "bcrypt";

@Path('/users')
export class UserController {
    private userService: UserService;
    private playerService: PlayerService;
    private authService: AuthenticationService;
    private config: IConfig;

    constructor() {
        this.userService = Container.get(UserService);
        this.authService = Container.get(AuthenticationService);
        this.playerService = Container.get(PlayerService);
        this.config = Container.get(IConfig);
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
            console.log(e.message);
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
        if (user.password === user.confirmation){
            const entity : UserEntity = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                hash: user.password,
                address: user.address,
                pseudo: user.pseudo,
            };
            entity.hash = hashSync(entity.hash, this.config.genSalt());
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
                const response: HttpResponseModel<IResourceId> = {
                    httpCode: 409,
                    data: null,
                    message: "User already exist"
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            }
        }
        else {
            const response: HttpResponseModel<IResourceId> = {
                httpCode: 400,
                message: "Password field is different of confirmation field",
                data: null
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
    }

    @Path("/:id/player")
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IResourceId>>(201, "Player created")
    @Response<HttpResponseModel<IResourceId>>(409, "Player already exist")
    @Response<HttpResponseModel<IResourceId>>(400)
    @POST
    public async registerPlayer(player: IPlayerResource): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        try {
            const entity: PlayerEntity = {
                user: await this.userService.findOne(player.userId),
                total_points: player.totalPoints,
                name: player.name,
            };
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
            let players = await user.players;
            if (!players){
                players = [];
            }
            const resource: IUserResource = {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                address: user.address,
                password: user.hash,
                pseudo: user.pseudo,
                email: user.email,
                gameProfile: players.map(player => {
                    const p : IGameProfileResource = {
                        total_points: player.total_points,
                        id: player.id,
                        name: player.name
                    };

                    return (p);
                })
            };
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
    @GET
    public async list(): Promise<SendResource<HttpResponseModel<IUserResource[]>>> {
        try {
            const users = await this.userService.findAll();
            const resources : IUserResource[] = users.map((user) => {
                const resource: IUserResource = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    address: user.address,
                    password: user.hash,
                    pseudo: user.pseudo,
                    email: user.email
                };

                return (resource);
            });
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

    @Path('/players/:userId')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "User list")
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
            const resources : IGameProfileResource[] = players.map((player) => {
                const resource: IGameProfileResource = {
                    total_points: player.total_points,
                    name: player.name,
                    id: player.id
                };

                return (resource);
            });
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
}
