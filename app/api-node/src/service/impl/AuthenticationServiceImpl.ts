import { AuthenticationService } from "../AuthenticationService";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { compare } from "bcrypt";
import { encode } from "jwt-simple";
import IConfig from "../IConfig";

@Singleton
export class AuthenticationServiceImpl implements AuthenticationService {

    @Inject
    private factory: IServiceFactory;

    @Inject
    private config: IConfig;

    public async authenticate(username: string, password: string): Promise<string> {
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
            const data = encode(payload, this.config.getSecret());
            return (data);
        }
        return (null);
    }
}
