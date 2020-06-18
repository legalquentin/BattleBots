import { Repository, EntityManager, EntityMetadata, getManager, getConnection, EntityRepository } from "typeorm";
import { SessionEntity } from "../entities/SessionEntity";
import { connectionName } from "../../service/util/connectionName";

@EntityRepository(SessionEntity)
export class SessionRepository extends Repository<SessionEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(SessionEntity);
    }
}