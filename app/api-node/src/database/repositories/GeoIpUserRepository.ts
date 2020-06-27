import { Repository, EntityRepository, EntityMetadata, EntityManager, getManager, getConnection } from "typeorm";
import { GeoIpUserEntity } from "../entities/GeoIpUserEntity";
import { Singleton } from "typescript-ioc";
import { connectionName } from "../../service/util/connectionName";

@Singleton
@EntityRepository(GeoIpUserEntity)
export class GeoIpUserRepository extends Repository<GeoIpUserEntity> {
    metadata: EntityMetadata;
    manager: EntityManager;

    constructor(){
        super();

        this.metadata = getConnection(connectionName()).getMetadata(GeoIpUserEntity);
        this.manager = getManager(connectionName());
    }

    async findByUser(userId: number){
        return (await this.find({
            where: {
                user: {
                    id: userId
                }
            }
        }));
    }
}