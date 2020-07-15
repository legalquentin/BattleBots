import { Container } from "typescript-ioc";
import * as fs from "fs";
import { GeoIpService } from "../../GeoIpService";

export async function preRequestGeoIp(req: any){
    const geoIpService: GeoIpService = Container.get(GeoIpService);
    const LOCAL_ADDRESS = "127.0.0.1";

    try {
        let geoip = null;

        if (req.socket.remoteAddress !== LOCAL_ADDRESS){
            geoip = await geoIpService.findByIp(req.socket.remoteAddress);

            if (geoip == null){
                geoip = await geoIpService.getInfo(req.socket.remoteAddress);
            }
            await geoIpService.save(geoip);
        }
    }
    catch (e){
        fs.appendFileSync(`./log.txt`, `log - preRequest - error - ${e.message}\n`);
    }
}