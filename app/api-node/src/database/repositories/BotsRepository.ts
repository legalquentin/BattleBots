import { Repository, EntityRepository, EntityMetadata, EntityManager, getConnection, getManager } from "typeorm";
import { RobotsEntity } from "../entities/RobotsEntity";
import { Singleton } from "typescript-ioc";

@Singleton
@EntityRepository(RobotsEntity)
export class BotsRepository extends Repository<RobotsEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(RobotsEntity);
        this.manager = getManager(process.env.NODE_ENV);
    }
}
