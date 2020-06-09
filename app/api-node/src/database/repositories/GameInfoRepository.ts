import { Repository, EntityManager, EntityMetadata, getManager, getConnection, EntityRepository } from "typeorm";
import { GameInfoEntity } from "../entities/GameInfoEntity";
import { connectionName } from "../../service/util/connectionName";
import { Singleton } from "typescript-ioc";

@EntityRepository(GameInfoEntity)
@Singleton
export class GameInfoRepository extends Repository<GameInfoEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(GameInfoEntity);
    }
}