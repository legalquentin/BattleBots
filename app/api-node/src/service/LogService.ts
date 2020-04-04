import { LogEntity } from "../database/entities/LogEntity";

export abstract class LogService {
    public abstract save(log: LogEntity): Promise<LogEntity>;
    public abstract complete(id: number): Promise<LogEntity>;
    public abstract list(): Promise<Array<LogEntity>>;
}