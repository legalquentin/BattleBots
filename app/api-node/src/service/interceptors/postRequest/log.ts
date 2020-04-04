import { Container } from "typescript-ioc";
import { LogService } from "../../LogService";

export async function postRequestLog(req: any, res: any){
    if (req.log){
        const logService = Container.get(LogService);

        console.log(res.statusCode);
        try {
            await logService.complete(req.log.id);
        }
        catch (e){
            console.log(`log - error - ${e.message}`);
        }
    }
}