import { UserService } from "../UserService";
import UserAsm from "../../resources/asm/UserAsm";
import IUserHttpModel from "../../resources/IUserHttpModel";
import HttpResponseModel from "../../resources/HttpResponseModel";
import ITokenHttp from "../../resources/ITokenHttp";
import IUserResource from "../../resources/IUserResource";
import IResourceId from "../../resources/IResourceId";
import { SendResource } from "../../../lib/ReturnExtended";
import { Inject } from "typescript-ioc";
import { encode } from "jwt-simple";
import { compare } from "bcrypt";
import UserEntity from "../../../src/database/entities/UserEntity";
import { PlayerEntity } from "../../../src/database/entities/PlayerEntity";
import * as _ from "lodash";
import { userResourceDecoder } from "../../validation/Validation";
import IConfig from "../IConfig";
import IServiceFactory from "../IServiceFactory";

export class UserServiceImpl implements UserService {
    @Inject
    factory: IServiceFactory;

    @Inject
    config: IConfig;

    @Inject
    userAsm: UserAsm;

    public async login(user: IUserHttpModel): Promise<SendResource<HttpResponseModel<ITokenHttp>>> {
        let users = await this.factory.getUserRepository().find({ where: [{ pseudo: user.username }, { email: user.username }] });
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
                return new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response);
            }
        }
        const response: HttpResponseModel<ITokenHttp> = {
            data: null,
            message: "user not found",
            httpCode: 404
        };
        return new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response);
    }

    public async register(user: IUserResource): Promise<SendResource<HttpResponseModel<IResourceId>>> {
        const entity = this.userAsm.toEntity(user);

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
            return (new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        } else if (_.trim(user.pseudo).length === 0 || _.trim(user.email).length === 0) {
            response.message = "fields cannot be null";
            return (new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
        try {
            userResourceDecoder.runWithException(user);
        }
        catch (e) {
            response.message = e.message;
            return (new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
        if (user.password !== user.confirmation) {
            response.message = "Password doesn't match confirmation field";
            return (new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
        let list = await this.factory.getUserRepository().find({ where: { pseudo: entity.pseudo } });
        if (!list) {
            list = [];
        }
        if (list.length === 0) {
            try {
                ret = await this.factory.getUserRepository().save(entity);
                const player: PlayerEntity = {
                    user: ret,
                    total_points: 0
                };
                await this.factory.getPlayerRepository().save(player);
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
        return (new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
    }

    public async profile(id: number): Promise<SendResource<HttpResponseModel<IUserResource>>>  {
        const entity = await this.factory.getPlayerRepository().findOne(id);
        const resource = this.userAsm.toPlayerResource(entity);
        const response: HttpResponseModel<IUserResource> = {
            httpCode: 200,
            message: "User find",
            data: resource
        };

        return (new SendResource<HttpResponseModel<IUserResource>>("UserController", response.httpCode, response));
    }

    public async list(): Promise<SendResource<HttpResponseModel<IUserResource[]>>> {
        const list = await this.factory.getPlayerRepository().find();
        const response: HttpResponseModel<IUserResource[]> = {
            httpCode: 200,
            message: "list user",
            data: this.userAsm.toPlayerResources(list)
        };

        return (new SendResource<HttpResponseModel<IUserResource[]>>("UserController", response.httpCode, response));
    }
}