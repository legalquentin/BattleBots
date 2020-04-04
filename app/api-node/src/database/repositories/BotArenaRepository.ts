import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { RobotsArenaEntity } from "../entities/RobotsArenaEntity";
import { Singleton } from "typescript-ioc";

@Singleton
@EntityRepository(RobotsArenaEntity)
export class BotArenaRepository extends Repository<RobotsArenaEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(RobotsArenaEntity);
    }
}