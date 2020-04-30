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

    public async update(log: LogEntity) : Promise<LogEntity> {
        try {
            await this.service.getLogRepository().update(log.id, log);
            return (log);
        }
        catch (e){
            throw e;
        }
    }

    public async findOne(id: number): Promise<LogEntity> {
        return this.service.getLogRepository().findOne(id);
    }


    public async list(): Promise<LogEntity[]> {
        return this.service.getLogRepository().find();
    }

}