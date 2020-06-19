import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { RobotsUserEntity } from "../entities/RobotsUserEntity";
import { Singleton, Container } from "typescript-ioc";
import { connectionName } from "../../service/util/connectionName";
import { BotsRepository } from "./BotsRepository";
import { UserRepository } from "./UserRepository";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";

@Singleton
@EntityRepository(RobotsUserEntity)
export class RobotsUserRepository extends Repository<RobotsUserEntity>{
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(RobotsUserEntity);
    }

    public async deleteByBot(botId: number){
        try {
            await this.createQueryBuilder("robotUser").delete().where("robotUser.bot_id = :id", {
                "id": botId
            });

            return (true);
        }
        catch (e){
            return (false);
        }
    }

    public async deleteByUser(userId: number){
        try {
            await this.createQueryBuilder().delete().where("user_id = :id", {
                "id": userId
            }).execute();

            return (true);
        }
        catch (e){
            return (false);
        }
    }

    public async linkBotToPlayer(botId: number, playerId: number): Promise<RobotsUserEntity> {
        const userRepository = Container.get(UserRepository);
        const botRepository = Container.get(BotsRepository);
        
        try {
            const bot = await botRepository.findOne(botId);
            if (!bot){
                throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
            }
            const player = await userRepository.findOne(playerId);
            if (!player){
                throw new EntityError(EEntityStatus.NOT_FOUND, "player not found");
            }
            const robotUser = new RobotsUserEntity();
            robotUser.robot = bot;
            robotUser.user = player;
            const ret = await this.save(robotUser);
            return (ret);
        }
        catch (e){
            throw new EntityError(EEntityStatus.INTERNAL_ERROR, e.message);
        }
    }
}
