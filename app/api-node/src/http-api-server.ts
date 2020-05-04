import { ApiServer } from "./api-server";
import * as http from "http";

export class HttpApiServer extends ApiServer{

    private httpServer: http.Server = null;

    public runServer() {
        return new Promise<any>((resolve, reject) => {
            this.httpServer = this.app.listen(this.PORT);
            console.log(`The server is started on ${this.scheme}://${this.serviceConfig.getApiAddress()}:${this.PORT}`);
        });
    }

    public closeServer() {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }
}
