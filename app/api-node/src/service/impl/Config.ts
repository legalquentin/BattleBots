import IConfig from "../IConfig";
import * as config from "config";

export default class Config extends IConfig{

    constructor(){
        super();
        this.secret = config.get('secrets.secret');
        this.salt = config.get('secrets.salt');
    }

    genSalt(): string{
        return (this.salt);
    }

    getSecret(): string{
        return (this.secret);
    }
};
