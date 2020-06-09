import { AuthenticationService } from "../AuthenticationService";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { compare } from "bcrypt";
import { sign, decode } from "jsonwebtoken";
import IConfig from "../IConfig";
import ITokenHttp from "../../resources/ITokenHttp";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";
import * as moment from "moment";

@Singleton
export class AuthenticationServiceImpl implements AuthenticationService {

    @Inject
    private factory: IServiceFactory;

    @Inject
    private config: IConfig;

    /**
     * The user have 5 minutes for refresh the token
     * 
     */
    public refresh(token: string) {
        try {
            const o: any = decode(token);
            const creationTime = moment(o.creationTime);
            const exp2 = creationTime.add({
                "seconds": parseInt(this.config.getExpirationTime()) + (5 * 60)
            });

            if (moment().isAfter(exp2)){
                const response: HttpResponseModel<ITokenHttp> = {
                    httpCode: 400
                };

                return (response);
            }
            o.creationTime = Date.now();
            const data = sign(o, this.config.getSecret(), {
                algorithm: "HS512"
            });
            const response : HttpResponseModel<ITokenHttp> = {
                httpCode: 200,
                data: {
                    data
                }
            };
            return (response);
        }
        catch (e){
            const response: HttpResponseModel<ITokenHttp> = {
                httpCode: 400
            };

            return (response);
        }
    }
    
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
                const data = sign(payload, this.config.getSecret(), {
                    algorithm: "HS512"
                });
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
                httpCode: 403,
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
