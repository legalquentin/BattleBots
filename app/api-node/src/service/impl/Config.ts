import IConfig from "../IConfig";
import * as config from "config";
import { Singleton } from "typescript-ioc";

@Singleton
export default class Config extends IConfig{

    constructor(){
        super();
        this.secret = config.get('secrets.secret');
        this.salt = config.get('secrets.salt');
        this.workerAddress = config.get('worker_address');
        this.workerPort = config.get('worker_port');
        this.workerDirectory = config.get('worker_directory');
        this.apiAddress = config.get('api_address');
        this.apiPort = config.get('api_port');
        this.apiScheme = config.get('api_scheme');
        this.apiUseSSL = config.get('api_useSSL') 
        this.homeApiNode =  config.get('home_api_node')  
        this.geoipService = config.get('geoip_service');     
    }

    getGeoIpService(): string {
        return (this.geoipService);
    }

    getApiAddress(): string {
        return (this.apiAddress);
    }

    getApiPort(): string {
        return (this.apiPort);
    }

    getApiUseSSL(): boolean {
       return (this.apiUseSSL);
    }

    getApiScheme(): string {
        return (this.apiScheme);
    }

    genSalt(): string{
        return (this.salt);
    }

    getSecret(): string{
        return (this.secret);
    }

    getWorkerAddress(): string {
        return this.workerAddress;
    }

    getWorkerPort(): string {
        return this.workerPort;
    }

    getWorkerDir(): string {
        return this.workerDirectory;
    }
    
    getHomeApiNode(): string {
        return this.homeApiNode;
    }
};
