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
            await this.createQueryBuilder("session").delete().where("session.game_id = :id", {
                id: game.id
            }).execute();
        
            return (true);
        }
        catch (e){
            return (false);
        }
    }
}