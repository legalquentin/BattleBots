import { Container } from "typescript-ioc";
import * as fs from "fs";
import { GeoIpService } from "../../GeoIpService";

export async function preRequestGeoIp(req: any){
    const geoIpService: GeoIpService = Container.get(GeoIpService);

    try {
        let geoip = await geoIpService.findByIp(req.socket.remoteAddress);

        if (geoip == null){
            await geoIpService.getInfo(req.socket.remoteAddress);
        }
    }
    catch (e){
        console.log(e.message);
        fs.appendFileSync(`./log.txt`, `log - preRequest - error - ${e.message}\n`);
    }
}