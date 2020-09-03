import { ApiServer } from "./api-server";
import * as https from "https";
import * as fs from "fs";

export class HttpsApiServer extends ApiServer{

    private httpsServer: https.Server = null;

    public runServer() {
    	return new Promise<any>((resolve, reject) => {
                    // Certificate
            const privateKey = fs.readFileSync('/etc/letsencrypt/live/ebotfight.com/privkey.pem', 'utf8');
            const certificate = fs.readFileSync('/etc/letsencrypt/live/ebotfight.com/cert.pem', 'utf8');
            const ca = fs.readFileSync('/etc/letsencrypt/live/ebotfight.com/chain.pem', 'utf8');

            const credentials = {
                key: privateKey,
                cert: certificate,
                ca: ca
            };
            this.httpsServer = https.createServer(credentials, this.app).listen(this.PORT, "0.0.0.0");
            console.log(`The server is started on ${this.scheme}://${this.serviceConfig.getApiAddress()}:${this.PORT}`);
            resolve(true);
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