import { Repository, EntityRepository, EntityMetadata, EntityManager, getManager, getConnection } from "typeorm";
import UserEntity from "../entities/UserEntity";
import { Singleton, Provider, Provided } from "typescript-ioc";

const provider : Provider = {
    get: () => {
        return process.env.NODE_ENV === "test" ? { find: () => {}, save: () => {}} : new UserRepository(null, null);
    }
};

@EntityRepository(UserEntity)
@Provided(provider)
@Singleton
export class UserRepository extends Repository<UserEntity> {
    constructor(public manager: EntityManager, public metadata: EntityMetadata) {
        super();
        this.manager = getManager("app");
        this.metadata = getConnection("app").getMetadata("users");
    }
}
