import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { LogEntity } from "../entities/LogEntity";
import { Singleton } from "typescript-ioc";
import { connectionName } from "../../service/util/connectionName";

@EntityRepository(LogEntity)
@Singleton
export class LogRepository extends Repository<LogEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(LogEntity);
    }
}