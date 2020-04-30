import { Container } from "typescript-ioc";
import { LogRepository } from "../../../database/repositories/LogRepository";
import * as  fs from "fs";

export async function postRequestLog(req: any, res: any){
    if (req.log){
        const logRepository = Container.get(LogRepository);

        try {
            const log = await logRepository.findOne(req.log.id);

            log.endTime = new Date();
            log.duration = new Date(log.endTime.getTime() - log.startTime.getTime());
            log.responseCode = res.statusCode;
            log.complete = 1;
            await logRepository.update(log.id, log);
        }
        catch (e){
            fs.appendFileSync(`./log.txt`, `log - postRequest - error - ${e.message}\n`);
        }
    }
}
