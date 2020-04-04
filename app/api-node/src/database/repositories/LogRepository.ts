import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { LogEntity } from "../entities/LogEntity";
import { Singleton } from "typescript-ioc";

@EntityRepository(LogEntity)
@Singleton
export class LogRepository extends Repository<LogEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(LogEntity);
    }
}