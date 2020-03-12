import { Repository, EntityRepository, EntityManager, getManager, getConnection, EntityMetadata } from "typeorm";
import { PlayerEntity } from "../entities/PlayerEntity";
import { Singleton } from "typescript-ioc";

@EntityRepository(PlayerEntity)
@Singleton
export class PlayerRepository extends Repository<PlayerEntity> {
    constructor(public manager: EntityManager, public metadata: EntityMetadata){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata("player");
    }
}