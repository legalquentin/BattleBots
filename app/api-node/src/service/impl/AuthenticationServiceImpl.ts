import { AuthenticationService } from "../AuthenticationService";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { compare } from "bcrypt";
import { encode } from "jwt-simple";
import IConfig from "../IConfig";
import ITokenHttp from "../../resources/ITokenHttp";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";

@Singleton
export class AuthenticationServiceImpl implements AuthenticationService {

    @Inject
    private factory: IServiceFactory;

    @Inject
    private config: IConfig;

    public async authenticate(username: string, password: string){
        try {
            const user = await this.factory.getUserRepository().findOne({
                where: [
                    {
                        pseudo: username
                    },
                    {
                        email: username
                    }
                ]
            });
            if (user != null && await compare(password, user.hash))
            {
                const payload: any = {};
                payload.sub = user.id;
                payload.role = user.roles;
                payload.creationTime = Date.now();
                const data = encode(payload, this.config.getSecret());
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
            }
            const response : HttpResponseModel<ITokenHttp> = {
                httpCode: 404,
                data: null,
                message: "User not found"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<ITokenHttp>>("UserController", response.httpCode, response));
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
}
