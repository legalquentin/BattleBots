import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { ConnectedUserEntity } from "../entities/ConnectedUserEntity";
import { connectionName } from "../../service/util/connectionName";
import { Singleton } from "typescript-ioc";

@Singleton
@EntityRepository(ConnectedUserEntity)
export class ConnectedUserRepository extends Repository<ConnectedUserEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(ConnectedUserEntity);
    }

    async getLatested(userId: number){
        const list = await this.createQueryBuilder("conn").where("conn.user_id = :id", {
            "id": userId
        }).orderBy("conn.id", "DESC").getMany();

        if (list.length) {
            return (list[0]);
        }
        return (null);
    }

    async getConnected(){
        const list = await this.createQueryBuilder("conn")
        .leftJoinAndSelect("conn.user", "user")
        .where("conn.endConnected > :date", {
            "date": new Date()
        })
        .groupBy("conn.id")
        .addGroupBy("user.id")
        .getMany();

        return (list);
    }

    async getDisconnected(){
        const list = await this.createQueryBuilder("conn").leftJoinAndSelect("conn.user", "user").groupBy("conn.id").addGroupBy("user.id").where("conn.endConnected < :date", {
            "date": new Date()
        }).getMany();

        return (list);
    }

    async getAll(){
        const list = await this.createQueryBuilder("conn").addSelect("conn.endConnected > CURRENT_TIMESTAMP", "isConnected").leftJoinAndSelect("conn.user", "user").groupBy("conn.id").addGroupBy("user.id").getMany();
        
        return (list);
    }
}