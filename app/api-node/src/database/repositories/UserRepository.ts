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
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(UserEntity);
    }

    public async saveOrUpdate(user: UserEntity){
        try {
            if (user.id)
            {
                await this.update(user.id, user);
                return (user);
            }
            else {
    
                await this.insert(user);
                return (user);
            }
        }
        catch (e){
            throw e;
        } 
    }
}
