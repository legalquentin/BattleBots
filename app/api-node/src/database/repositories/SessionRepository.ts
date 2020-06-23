import { Repository, EntityManager, EntityMetadata, getManager, getConnection, EntityRepository } from "typeorm";
import { SessionEntity } from "../entities/SessionEntity";
import { connectionName } from "../../service/util/connectionName";
import { GameEntity } from "../entities/GameEntity";

@EntityRepository(SessionEntity)
export class SessionRepository extends Repository<SessionEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(SessionEntity);
    }

    async deleteAllByGame(game: GameEntity){
        try {
            await this.createQueryBuilder().delete().where("game_id = :id", {
                id: game.id
            }).execute();
        
            return (true);
        }
        catch (e){
            return (false);
        }
    }

    async search(gameId: number, playerId: number){
        return ((await this.createQueryBuilder().where("game_id = :gameId", {
            "gameId": gameId
        }).andWhere("player_id = :playerId", {
            "playerId": playerId
        })).getMany());
    }

    async findByGameId(gameId: number){
        const list = await this.createQueryBuilder().where("game_id = :id", {
            "id": gameId
        }).getMany();

        return (list);
    }
}