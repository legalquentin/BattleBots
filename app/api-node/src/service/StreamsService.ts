import { StreamsEntity } from "../database/entities/StreamsEntity";
import { IStreamResource } from "../resources/IStreamResource";

export abstract class StreamsService {
    public abstract saveOrUpdate(stream: IStreamResource);
    public abstract deleteOne(id: number);
    public abstract getOne(id: number);
    public abstract search(options: any): Promise<StreamsEntity[]>;
    public abstract findAll();
    public abstract deleteByBot(botId: number): Promise<any>;
    public abstract watchDirectory(stream: IStreamResource);
    public abstract upload(stream: StreamsEntity, params: any, callback: any);
    public abstract getVideoLink(stream: StreamsEntity);
}