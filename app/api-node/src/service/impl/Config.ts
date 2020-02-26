import { Provides, Singleton } from "typescript-ioc";
import IConfig from "../IConfig";

@Provides(IConfig)
@Singleton
export default class Config implements IConfig{
    salt = 10;
    secret = "azerty123";

    genSalt(){
        return (this.salt);
    }

    getSecret(){
        return (this.secret);
    }
};
