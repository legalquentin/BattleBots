import { Repository, getManager, getConnection, EntityManager, EntityMetadata, EntityRepository } from "typeorm";
import { Singleton } from "typescript-ioc";
import { GameEntity } from "../entities/GameEntity";

@EntityRepository(GameEntity)
@Singleton
export class GameRepository extends Repository<GameEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(GameEntity);
    }
}
