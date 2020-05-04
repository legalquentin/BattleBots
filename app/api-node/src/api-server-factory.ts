import { ApiServer } from "./api-server";
import IConfig from "./service/IConfig";
import { HttpsApiServer } from "./https-api-server";
import { HttpApiServer } from "./http-api-server";
import Config from "./service/impl/Config";

export class ApiServerFactory {

    serviceConfig: IConfig;

    constructor(){
        this.serviceConfig = new Config();
    }

    getServer() : ApiServer{
        if (this.serviceConfig.getApiUseSSL()){
            return new HttpsApiServer();
        }
        else {
            return new HttpApiServer();
        }
    }
}
