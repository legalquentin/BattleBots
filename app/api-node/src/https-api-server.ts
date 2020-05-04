import { ApiServer } from "./api-server";
import * as https from "https";
import * as fs from "fs";

export class HttpsApiServer extends ApiServer{

    private httpsServer: https.Server = null;

    public runServer() {
        return new Promise<any>((resolve, reject) => {
            this.options = {
                key: fs.readFileSync(`../../../infra/api-ssl/key.pem`, {
                    encoding: "utf8"
                }),
                cert: fs.readFileSync(`../../../infra/api-ssl/cert.pem`, {
                    encoding: "utf8"
                })
            };
            this.httpsServer = https.createServer(this.options, this.app).listen(this.PORT);
            console.log(`The server is started on ${this.scheme}://${this.serviceConfig.getApiAddress()}:${this.PORT}`);
        });
    }

    public closeServer() {
        return new Promise((resolve, reject) => {
            if (this.httpsServer) {
                this.httpsServer.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

}  