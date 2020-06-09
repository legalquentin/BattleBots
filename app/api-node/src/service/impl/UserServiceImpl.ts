import { UserService } from "../UserService";
import UserEntity from "../../../src/database/entities/UserEntity";
import * as _ from "lodash";
import IServiceFactory from "../IServiceFactory";
import { Singleton, Inject, Container } from "typescript-ioc";
import { hashSync } from "bcrypt";
import IConfig from "../IConfig";
import { UserResourceAsm } from "../../resources/asm/UserResourceAsm";
import IUserResource from "../../resources/IUserResource";
import IResourceId from "../../resources/IResourceId";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";
import IGameProfileResource from "../../resources/IGameProfileResource";
import { ERolesStatus } from "../../resources/ERolesStatus";

@Singleton
export class UserServiceImpl implements UserService {

    @Inject
    factory: IServiceFactory;

    @Inject
    config: IConfig;

    public async saveOrUpdate(user: IUserResource){
        const userResourceAsm = Container.get(UserResourceAsm);

        try {
            const entity = userResourceAsm.toEntity(user);

            entity.roles = ERolesStatus.ROLE_USER;
            if (!entity.hash){
                const response: HttpResponseModel<IResourceId> = {
                    httpCode: 400,
                    message: "Check password",
                };
    
                return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            }
	    entity.hash = hashSync(entity.hash, this.config.genSalt());
	    const savedUser = await this.factory.getUserRepository().saveOrUpdate(entity);
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
                httpCode: 400,
                message: "Conflict or internal error"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }           
    }

    public async findAll(){
        const userResourceAsm = Container.get(UserResourceAsm);
        try {
            let users = await this.factory.getUserRepository().find();
            if (!users){
                users = [];
            }
            const resources : IUserResource[] = await userResourceAsm.toResources(users);
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

    public async deleteOne(id: number){
        try {
            const user = await this.factory.getUserRepository().findOne(id);

            if (user == null){
                await this.factory.getUserRepository().delete(user.id);
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

    public async findOne(id: number){
        const userResourceAsm = Container.get(UserResourceAsm);
        try {
            const user : UserEntity = await this.factory.getUserRepository().findOne(id);
            const notFound : HttpResponseModel<IUserResource> = {
                httpCode: 404,
                message: "User not found",
                data: null
            };
            if (!user){
                return Promise.resolve(new SendResource<HttpResponseModel<IUserResource>>("UserController", notFound.httpCode, notFound));
            }
            const resource: IUserResource = await userResourceAsm.toResource(user);
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
}
