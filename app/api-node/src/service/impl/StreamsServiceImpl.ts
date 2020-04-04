import { StreamsService } from "../StreamsService";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";

@Singleton
export class StreamsServiceImpl implements StreamsService {

    @Inject
    private service: IServiceFactory;

    public async saveOrUpdate(stream: StreamsEntity): Promise<StreamsEntity> {
        try {
            if (stream.id){
                await this.service.getStreamsRepository().update(stream.id, stream);
                
                return (stream);
            }
            else {
                const saved = this.service.getStreamsRepository().save(stream);

                return (saved);
            }
        }
        catch (e)
        {
            throw e;
        }
    }    
    
    public async deleteOne(id: number): Promise<Boolean> {
        try {
            const stream = await this.service.getStreamsRepository().findOne(id);

            if (stream){
                await this.service.getStreamsRepository().delete(stream.id);

                return (true);
            }
            return (false);
        }
        catch (e){
            return (false);
        }

    }

    public async findOne(id: number): Promise<StreamsEntity> {
        return this.service.getStreamsRepository().findOne(id);
    }

    public search(options: any): Promise<StreamsEntity[]> {
        throw new Error("Method not implemented.");
    }

    public findAll(): Promise<StreamsEntity[]> {
        return this.service.getStreamsRepository().find();
    }
}