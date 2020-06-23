import { Repository, EntityRepository, EntityMetadata, EntityManager, getManager, getConnection } from "typeorm";
import UserEntity from "../entities/UserEntity";
import { Singleton } from "typescript-ioc";
import { connectionName } from "../../service/util/connectionName";

@EntityRepository(UserEntity)
@Singleton
export class UserRepository extends Repository<UserEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor() {
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(UserEntity);
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

    public async getAllPositions(userId: number){
        const list = await this.
        createQueryBuilder("user").
        leftJoinAndSelect("user.geoips", "geoips").
        leftJoinAndSelect("geoips.geoip", "geoip").
        where("user.id = :id", {
            "id": userId
        }).
        getMany();

        if (list && list.length){
            return (list[0]);
        }
        return (null);
    }
}
