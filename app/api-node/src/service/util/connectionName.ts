import * as config from "config";

export function connectionName(){
    const ENV = "NODE_ENV";
    const defaultEnv = "development";
    const connectionName = config.util.getEnv(ENV) ? config.util.getEnv(ENV) : defaultEnv;

    return (connectionName);
}
