import { Repository, EntityManager, EntityMetadata, getManager, getConnection, EntityRepository } from "typeorm";
import { RobotGameEntity } from "../entities/RobotGameEntity";
import { Singleton } from "typescript-ioc";

@Singleton
@EntityRepository(RobotGameEntity)
export class BotGameRepository extends Repository<RobotGameEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(RobotGameEntity);
    }
}
