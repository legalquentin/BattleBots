import { Repository, EntityRepository, EntityMetadata, EntityManager, getManager, getConnection } from "typeorm";
import UserEntity from "../entities/UserEntity";
import { Singleton } from "typescript-ioc";

@EntityRepository(UserEntity)
@Singleton
export class UserRepository extends Repository<UserEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;
    
    constructor() {
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata("users");
    }
}
