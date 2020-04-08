import { StreamsService } from "../StreamsService";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";

@Singleton
export class StreamsServiceImpl implements StreamsService {

    @Inject
    private service: IServiceFactory;

    public async saveOrUpdate(stream: StreamsEntity): Promise<StreamsEntity> {
        if (stream.robot){
            const isSaved = await this.service.getBotsRepository().findOne(stream.robot.id) != null;

            if (isSaved){
                await this.service.getBotsRepository().update(stream.robot.id, stream.robot);
            }
            else{
                await this.service.getBotsRepository().save(stream.robot);
            }
        }
        if (stream.game){
            const isSaved = await this.service.getGameRepository().findOne(stream.game.id) != null;

            if (isSaved){
                await this.service.getGameRepository().update(stream.game.id, stream.game);
            }
            else{
                await this.service.getGameRepository().save(stream.game);
            }
        }
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

    public async deleteByBot(botId: number){
        return this.service.getStreamsRepository().createQueryBuilder().delete().from(StreamsEntity).where("robot_id = :id", {
            "id": botId
        }).execute();
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