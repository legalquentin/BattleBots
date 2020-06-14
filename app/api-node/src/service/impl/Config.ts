import IConfig from "../IConfig";
import * as config from "config";
import { Singleton } from "typescript-ioc";

@Singleton
export default class Config extends IConfig{

    constructor(){
        super();
        this.secret = config.get('secrets.secret');
        this.salt = config.get('secrets.salt');
        this.expirationTime = config.get('secrets.expiration_time');
        this.workerAddress = config.get('worker_address');
        this.workerPort = config.get('worker_port');
        this.workerDirectory = config.get('worker_directory');
        this.apiAddress = config.get('api_address');
        this.apiPort = config.get('api_port');
        this.apiScheme = config.get('api_scheme');
        this.apiUseSSL = config.get('api_useSSL') 
        this.homeApiNode =  config.get('home_api_node')  
        this.geoipService = config.get('geoip_service');
        this.s3dir = config.get('s3_dir');
        this.bucket = config.get('bucket');
        this.expireUrl = config.get('url_expire');
        this.accessKeyId = config.get('accessKeyId');
        this.secretAccessKey = config.get('secretAccessKey');
    }

    getAccessKeyId(): string {
        return (this.accessKeyId);
    }
    
    getSecretAccessKey(): string {
        return (this.secretAccessKey);
    }

    getExpireUrl(): string {
        return (this.expireUrl);
    }

    getBucket(): string {
        return (this.bucket);
    }

    getS3Dir(): string {
        return (this.s3dir);
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

    getExpirationTime(): string {
        return (this.expirationTime);
    }
};
