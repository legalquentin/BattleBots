'use strict';

import { Path, POST, GET, PathParam, Security } from "typescript-rest";
import IUserResource from "../resources/IUserResource";
import IUserHttpModel from "../resources/IUserHttpModel";
import UserEntityAsm from "../resources/asm/UserEntityAsm";
import UserEntity from "../database/entities/UserEntity";
import IResourceId from "../resources/IResourceId";
import { encode } from "jwt-simple";
import { compare } from "bcrypt";
import Config from "../service/impl/Config";
import ITokenHttp from "../resources/ITokenHttp";
import Response from "../resources/Response";
import { SendResource } from "../../lib/ReturnExtended";
import { userResourceDecoder } from "../validation/Validation";
import { PlayerEntity } from "../database/entities/PlayerEntity";
import * as _ from "lodash";
import { Container } from "typescript-ioc";
import { UserRepository } from "../database/repositories/UserRepository";
import { PlayerRepository } from "../database/repositories/PlayerRepository";

@Path('/users')
export class UserController {

    repository: UserRepository;
    playerRepository: PlayerRepository;

    constructor() {
        this.repository = Container.get(UserRepository);
        this.playerRepository = Container.get(PlayerRepository);
    }

    @Path('/login')
    @POST public loginRoute(user: IUserHttpModel) {
        return new Promise<SendResource<Response<ITokenHttp>>>(async (end) => {
            try {
                let users = await this.repository.find({ where: { pseudo: user.username } });
                if (!users) {
                    users = [];
                }
                for (let player of users) {
                    if (await compare(user.password, player.hash)) {
                        const payload: any = {};
                        payload.sub = player.id;
                        payload.role = "ROLE_USER";
                        const data = encode(payload, new Config().getSecret());
                        const token: ITokenHttp = {
                            data: data
                        };
                        const response: Response<ITokenHttp> = {
                            message: "User find",
                            httpCode: 200,
                            data: token
                        };
                        end(new SendResource<Response<ITokenHttp>>("UserController", response.httpCode, response));
                        return;
                    }
                }
                const response: Response<ITokenHttp> = {
                    data: null,
                    message: "user not found",
                    httpCode: 404
                };
                end(new SendResource<Response<ITokenHttp>>("UserController", response.httpCode, response));
            }
            catch (e) {
                const response: Response<ITokenHttp> = {
                    data: null,
                    message: "internal error",
                    httpCode: 500
                };
                end(new SendResource<Response<ITokenHttp>>("UserController", response.httpCode, response));
            }
        });
    }

    @Path('/')
    @POST
    public register(user: IUserResource): Promise<SendResource<Response<IResourceId>>> {
        const asm = new UserEntityAsm();
        const entity = asm.toEntity(user);

        return new Promise<SendResource<Response<IResourceId>>>(async (end) => {
            const idResource: IResourceId = {
                id: -1
            };
            let ret: UserEntity = null;
            const response: Response<IResourceId> = {
                data: idResource,
                httpCode: 400,
                message: "User created"
            };

            if (_.trim(user.password).length === 0) {
                response.message = "password cannot be null";
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
            } else if (_.trim(user.pseudo).length === 0 || _.trim(user.email).length === 0) {
                response.message = "fields cannot be null";
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
            }
            try {
                userResourceDecoder.runWithException(user);
            }
            catch (e) {
                response.message = e.message;
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
            }
            if (user.password !== user.confirmation) {
                response.message = "Password doesn't match confirmation field";
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
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
                    console.log(player);
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
            end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
        });
    }

    @Path('/:id')
    @Security("ROLE_USER")
    @GET
    public read(@PathParam("id") id: number): Promise<SendResource<Response<IUserResource>>> {
        const asm = new UserEntityAsm();

        return new Promise<SendResource<Response<IUserResource>>>(async end => {
            const entity = await this.repository.findOne(id);
            const resource = asm.toResource(entity);
            const response: Response<IUserResource> = {
                httpCode: 200,
                message: "User find",
                data: resource
            };

            end(new SendResource<Response<IUserResource>>("UserController", response.httpCode, response));
        });
    }

    @Path('/')
    @Security("ROLE_USER")
    @GET
    public list(): Promise<SendResource<Response<IUserResource[]>>> {
        const asm = new UserEntityAsm();
        return new Promise<SendResource<Response<IUserResource[]>>>(async (end) => {
            const list = await this.playerRepository.find();
            const response: Response<IUserResource[]> = {
                httpCode: 200,
                message: "list user",
                data: asm.toPlayerResources(list)
            };

            end(new SendResource<Response<IUserResource[]>>("UserController", response.httpCode, response));
        });
    }
}