import { LogService } from "../LogService";
import { LogEntity } from "../../database/entities/LogEntity";
import { Inject } from "typescript-ioc";
import IServiceFactory from "../IServiceFactory";

export class LogServiceImpl implements LogService {

    @Inject
    private service: IServiceFactory;

    public async save(log: LogEntity): Promise<LogEntity> {
        try  {
            return await this.service.getLogRepository().save(log);   
        }
        catch (e){
            throw e;
        }
    }

    public async complete(id: number): Promise<LogEntity> {
        try {
            const log: LogEntity  = await this.service.getLogRepository().findOne(id);

            log.complete = 1;
            delete log.createdAt;
            delete log.updatedAt;
            await this.service.getLogRepository().update(id, log);
            return (log);
        } catch (e){
            throw e;
        }
    } 

    public async list(): Promise<LogEntity[]> {
        return this.service.getLogRepository().find();
    }

}