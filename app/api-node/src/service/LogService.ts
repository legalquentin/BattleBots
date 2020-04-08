import { LogEntity } from "../database/entities/LogEntity";

export abstract class LogService {
    public abstract save(log: LogEntity): Promise<LogEntity>;
    public abstract update(log: LogEntity): Promise<LogEntity>;
    public abstract list(): Promise<Array<LogEntity>>;
    public abstract findOne(id: number): Promise<LogEntity>;
}