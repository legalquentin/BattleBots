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
import { Consumes, Produces, Response } from "typescript-rest-swagger";
import { UserService } from "../service/UserService";
import { AuthenticationService } from "../service/AuthenticationService";
import { PlayerService } from "../service/PlayerService";
import IGameProfileResource from "../resources/IGameProfileResource";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";

@Path('/api/users')
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class UserController {
    private userService: UserService;
    private playerService: PlayerService;
    private authService: AuthenticationService;

    constructor() {
        this.userService = Container.get(UserService);
        this.authService = Container.get(AuthenticationService);
        this.playerService = Container.get(PlayerService);
    }

    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<ITokenHttp>>(200, "User find")
    @Response<HttpResponseModel<ITokenHttp>>(404, "user not found")
    @Path('/login')
    @POST 
    public async loginRoute(user: IUserHttpModel): Promise<SendResource<HttpResponseModel<ITokenHttp>>> {
        return this.authService.authenticate(user.username, user.password);
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

    @Path("/:id/player")
    @POST
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IResourceId>>(201, "Player created")
    @Response<HttpResponseModel<IResourceId>>(409, "Player already exist")
    @Response<HttpResponseModel<IResourceId>>(400)
    public async registerPlayer(player: IGameProfileResource, @PathParam("id") id: number): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        return this.playerService.register(player, id);
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

    @Path('/:userId/players')
    @Security("ROLE_USER", "Bearer")
    @Consumes("application/json;charset=UTF-8")
    @Produces("application/json;charset=UTF-8")
    @Response<HttpResponseModel<IUserResource[]>>(200, "User list")
    @Response<HttpResponseModel<IUserResource[]>>(400)
    @GET
    public async players(@PathParam("userId")userId: number): Promise<SendResource<HttpResponseModel<IGameProfileResource[]>>> {
        return (this.playerService.search(userId));
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
        return (this.playerService.deleteOne(playerId));
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
