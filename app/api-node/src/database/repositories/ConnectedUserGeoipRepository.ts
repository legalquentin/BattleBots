import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { ConnectedUserGeoipEntity } from "../entities/ConnectedUserGeoipEntity";
import { connectionName } from "../../service/util/connectionName";
import { Singleton } from "typescript-ioc";

@Singleton
@EntityRepository(ConnectedUserGeoipEntity)
export class ConnectedUserGeoipRepository extends Repository<ConnectedUserGeoipEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();

        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(ConnectedUserGeoipEntity);
    }

    async findByConnectedUser(userId: number){
        return (await this.find({
            where: {
                connectedUser: {
                    id: userId
                }
            }
        }));
    }
}