import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { StreamsEntity } from "../entities/StreamsEntity";
import { Singleton } from "typescript-ioc";
import { connectionName } from "../../service/util/connectionName";
import { GameEntity } from "../entities/GameEntity";

@Singleton
@EntityRepository(StreamsEntity)
export class StreamsRepository extends Repository<StreamsEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(StreamsEntity);
    }

    public async hasStream(gameId: number){
        const entities = await this.createQueryBuilder("streams").leftJoinAndSelect("streams.game", "game").where("game.id = :id", {
            "id": gameId
        }).getMany();

        return (entities && entities.length > 0);
    }

    public async search(botId: number, gameId: number){
        return (await this.createQueryBuilder("stream").where("stream.robot_id = :id", {
            "id": botId
        }).andWhere("stream.game_id = :gameId", {
            "gameId": gameId
        }).getMany());
    }

    public async deleteByBot(botId: number){
        return this.createQueryBuilder().delete().from(StreamsEntity).where("robot_id = :id", {
            "id": botId
        }).execute();
    }

    public async deleteByGame(game: GameEntity){
        try {
            await (this.createQueryBuilder().delete().where("game_id = :id", {
                "id": game.id
            })).execute();
        
            return (true);
        }
        catch (e){
            console.log(e.message);

            return (false);
        }
    }

    public async saveOrUpdate(stream: StreamsEntity): Promise<StreamsEntity> {
        try {
            if (stream.id){
                await this.update(stream.id, stream);
                
                return (stream);
            }
            else {
                const saved = await this.save(stream);

                return (saved);
            }
        }
        catch (e)
        {
            throw e;
        }
    }
}
