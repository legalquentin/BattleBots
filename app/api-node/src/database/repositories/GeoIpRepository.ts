import { Repository, EntityManager, EntityMetadata, getManager, getConnection, EntityRepository } from "typeorm";
import { GeoIpEntity } from "../entities/GeoIpEntity";
import { connectionName } from "../../service/util/connectionName";
import { Singleton } from "typescript-ioc";

@EntityRepository(GeoIpEntity)
@Singleton
export class GeoIpRepository extends Repository<GeoIpEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(GeoIpEntity);
    }
}