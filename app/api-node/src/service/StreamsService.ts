import { StreamsEntity } from "../database/entities/StreamsEntity";

export abstract class StreamsService {
    public abstract saveOrUpdate(player: StreamsEntity) : Promise<StreamsEntity>;
    public abstract deleteOne(id: number) : Promise<Boolean>;
    public abstract findOne(id: number) : Promise<StreamsEntity>;
    public abstract search(options: any): Promise<StreamsEntity[]>;
    public abstract findAll(): Promise<Array<StreamsEntity>>;
}