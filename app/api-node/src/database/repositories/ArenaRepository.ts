import { Repository, EntityRepository, EntityManager, EntityMetadata, getConnection, getManager } from "typeorm";
import { ArenaEntity } from "../entities/ArenaEntity";
import { Singleton } from "typescript-ioc";

@Singleton
@EntityRepository(ArenaEntity)
export class ArenaRepository extends Repository<ArenaEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    public ArenaRepository(){
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(ArenaEntity);
        this.manager = getManager(process.env.NODE_ENV);
    }
}