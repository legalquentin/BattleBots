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
};
