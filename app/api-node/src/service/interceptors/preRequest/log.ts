import { Container } from "typescript-ioc";
import { LogEntity } from "../../../database/entities/LogEntity";
import { LogRepository } from "../../../database/repositories/LogRepository";
import * as fs from "fs";
import { UserRepository } from "../../../database/repositories/UserRepository";
import { GeoIpService } from "../../GeoIpService";
import * as express from "express";

export async function preRequestLog(req: express.Request){
    const logRepository = Container.get(LogRepository);
    const userRepository  = Container.get(UserRepository);
    const geoIpService = Container.get(GeoIpService);
    const log = new LogEntity();

    log.complete = 0;
    log.method = req.method
    log.path = req.path;
    log.startTime = new Date();
    if (req['rawBody']){
        log.body = req['rawBody'];
    }
    if (req.user){
        try {
            const user = await userRepository.findOne(req.user.sub);

            log.user = user;
        }
        catch (e)
        {
            fs.appendFileSync(`./log.txt`, `log - preRequest - error - ${e.message}\n`);
        }
    }
    try {
        const saved = await logRepository.save(log);
        req['log'] = {
            id: saved.id
        };
        await geoIpService.getInfo(saved.id, req.socket.remoteAddress);
    }
    catch (e){
         fs.appendFileSync(`./log.txt`, `log - preRequest - error - ${e.message}\n`);
    }
}