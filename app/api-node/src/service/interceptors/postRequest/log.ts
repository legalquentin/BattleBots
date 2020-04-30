import { Container } from "typescript-ioc";
import { LogService } from "../../LogService";

export async function postRequestLog(req: any, res: any){
    if (req.log){
        const logService = Container.get(LogService);

        try {
            const log = await logService.findOne(req.log.id);

            log.endTime = new Date();
            log.duration = new Date(log.endTime.getTime() - log.startTime.getTime());
            log.responseCode = res.statusCode;
            log.complete = 1;
            await logService.update(log);
        }
        catch (e){
            console.log(`log - error - ${e.message}`);
        }
    }
}
