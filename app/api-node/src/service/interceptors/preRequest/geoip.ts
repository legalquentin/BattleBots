import { Container } from "typescript-ioc";
import * as fs from "fs";
import { UserRepository } from "../../../database/repositories/UserRepository";
import { GeoIpService } from "../../GeoIpService";
import * as express from "express";

export async function preRequestGeoIp(req: express.Request){
    const userRepository  = Container.get(UserRepository);
    const geoIpService = Container.get(GeoIpService);
    const LOCAL_ADDRESS = "127.0.0.1";

    if (req.user){
        try {
            const user = await userRepository.findOne(req.user.id);
            
            if (req.socket.remoteAddress !== LOCAL_ADDRESS){
                await geoIpService.getInfo(user.id, req.socket.remoteAddress);
            }
        }
        catch (e)
        {
            fs.appendFileSync(`./log.txt`, `log - preRequest - error - ${e.message}\n`);
        }
    }
}