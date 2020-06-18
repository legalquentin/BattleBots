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

    public async findByGame(gameId: number){
        try {
            this.createQueryBuilder("user").
            leftJoinAndSelect("user.gameUsers", "gameUsers").
            leftJoinAndSelect("gameUsers.game", "game").
            leftJoinAndSelect("user.robotsUser", "robotsUser").
            leftJoinAndSelect("robotsUser.robot", "robot").
            leftJoinAndSelect("robot.robotGame", "gameRobot").
            leftJoinAndSelect("gameRobot.game", "game_1").
            where("game.id = :id", {
                id: gameId
            });
        }
        catch (e){
            return (false);
        }
    }
}
