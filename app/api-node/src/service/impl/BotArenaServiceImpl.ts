import { BotArenaService } from "../BotArenaService";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject } from "typescript-ioc";

export class BotArenaServiceImpl implements BotArenaService {

    @Inject
    private service: IServiceFactory;

    public async save(botArena: RobotsArenaEntity): Promise<RobotsArenaEntity> {
        try {
            const saved = await this.service.getBotsArenaRepository().save(botArena);

            return (saved);
        }
        catch (e){
            throw e;
        }
    }    

    public async delete(robotId: number, arenaId: number): Promise<Boolean> {
        try {
            const finded = await this.findOne(robotId, arenaId);

            if (finded){
                await this.service.getBotsArenaRepository().createQueryBuilder().delete().from(RobotsArenaEntity).where("bot_id = :bot_id AND arena_id = :arena_id", {
                    arena_id: arenaId,
                    bot_id: robotId
                }).execute();

                return (true);
            }
            return (false);
        }
        catch (e){
            throw e;
        }
    }

    public async findOne(robotId: number, arenaId: number): Promise<RobotsArenaEntity> {
        const botArena = await this.service.getBotsArenaRepository().
            createQueryBuilder("robotarena").
            where("robotarena.bot_id = :bot_id", {
                bot_id: robotId 
            }).andWhere("robotarena.arena_id = :arena_id", {
                arena_id: arenaId
            }).getOne();

        return (botArena);
    }

    public findAll(): Promise<RobotsArenaEntity[]> {
        return (this.service.getBotsArenaRepository().find());
    }
}