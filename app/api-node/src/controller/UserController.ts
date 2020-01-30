'use strict';

import { Path, POST, GET, PathParam, Security } from "typescript-rest";
import IUserResource from "../http-models/IUserResource";
import IUserHttpModel from "../http-models/IUserHttpModel";
import { getRepository, Repository } from "typeorm";
import UserEntityAsm from "../service/UserEntityAsm";
import UserEntity from "../database/entities/UserEntity";
import IResourceId from "../http-models/IResourceId";
import { encode } from "jwt-simple";
import { compare } from "bcrypt";
import Config from "../service/config";
import ITokenHttp from "../http-models/ITokenHttp";
import Response from "../http-models/Response";
import { SendResource } from "../../lib/ReturnExtended";
import { userResourceDecoder } from "../service/Validation";

@Path('/users')
export class UserController {

    repository: Repository<UserEntity>;

    constructor() {
        this.repository = getRepository(UserEntity);
    }

    @Path('/login')
    @POST public loginRoute(user: IUserHttpModel) {
        return new Promise<SendResource<Response<ITokenHttp>>>(async (end) => {
            const users = await this.repository.find({ where: { pseudo: user.username } });

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
        });
    }

    @Path('/')
    @POST public register(user: IUserResource): Promise<SendResource<Response<IResourceId>>> {
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
            user.createdAt = (+new Date()).toString();
            user.updatedAt = (+new Date()).toString();

            // TODO: check regex user credentials
            if (user.password === "") {
                response.message = "password cannot be null";
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
            } else if (user.pseudo === "" || user.email === "") {
                response.message = "fields cannot be null";
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
            }
            try {
                userResourceDecoder.runWithException(user);
            }
            catch (e){
                response.message = e.message;
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
            }

            // TODO: check regex user credentials


            if (user.password !== user.confirmation) {
                response.message = "Password doesn't match confirmation field";
                return end(new SendResource<Response<IResourceId>>("UserController", response.httpCode, response));
            }
            const list = await this.repository.find({ where: { pseudo: entity.pseudo } });

            console.info(list);

            if (list.length === 0) {
                try {
                    ret = await this.repository.save(entity);
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
    @GET public list(): Promise<SendResource<Response<IUserResource[]>>> {
        const asm = new UserEntityAsm();

        return new Promise<SendResource<Response<IUserResource[]>>>(async end => {
            const list = await this.repository.find();
            const response: Response<IUserResource[]> = {
                httpCode: 200,
                message: "list user",
                data: asm.toResources(list)
            };

            end(new SendResource<Response<IUserResource[]>>("UserController", response.httpCode, response));
        });
    }
}