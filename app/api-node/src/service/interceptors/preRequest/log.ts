import { Container } from "typescript-ioc";
import { LogService } from "../../LogService";
import { UserService } from "../../UserService";
import { LogEntity } from "../../../database/entities/LogEntity";

export async function preRequestLog(req: any){
    const logService = Container.get(LogService);
    const userService  = Container.get(UserService);
    const log = new LogEntity();

    log.complete = 0;
    log.method = req.method;
    log.path = req.path;
    log.startTime = new Date();
    if (req.rawBody){
        log.body = req.rawBody;
    }
    if (req.user){
        try {
            const user = await userService.findOne(req.user.sub);

            log.user = user;
        }
        catch (e)
        {
            console.log(`log - error - ${e.message}`);
        }
    }
    try {
        const saved = await logService.save(log);
        req.log = {
            id: saved.id
        };
    }
    catch (e){
        console.log(`log - error - ${e.message}`);
    }
}