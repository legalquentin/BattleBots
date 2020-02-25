import { Repository, EntityRepository, EntityMetadata, EntityManager, getManager, getConnection } from "typeorm";
import UserEntity from "../entities/UserEntity";
import { Singleton } from "typescript-ioc";

@EntityRepository(UserEntity)
@Singleton
export class UserRepository extends Repository<UserEntity> {
    constructor(public manager: EntityManager, public metadata: EntityMetadata) {
        super();
        this.manager = getManager("app");
        this.metadata = getConnection("app").getMetadata("users");
    }
}
