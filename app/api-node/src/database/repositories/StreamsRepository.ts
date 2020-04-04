import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { StreamsEntity } from "../entities/StreamsEntity";
import { Singleton } from "typescript-ioc";

@Singleton
@EntityRepository(StreamsEntity)
export class StreamsRepository extends Repository<StreamsEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(StreamsEntity);
    }
}