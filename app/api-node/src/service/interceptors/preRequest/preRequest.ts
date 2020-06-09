import { preRequestLog } from "./log";
import { preRequestGeoIp } from "./geoip"; 

export async function preRequest(req: any){
    await preRequestLog(req);
    await preRequestGeoIp(req);
    return (req);
}