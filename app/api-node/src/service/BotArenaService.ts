import { RobotsArenaEntity } from "../database/entities/RobotsArenaEntity";

export abstract class BotArenaService {
    public abstract save(botArena: RobotsArenaEntity): Promise<RobotsArenaEntity>;
    public abstract delete(robotId: number, arenaId: number): Promise<Boolean>;
    public abstract findOne(robotId: number, arenaId: number): Promise<RobotsArenaEntity>;
    public abstract findAll(): Promise<Array<RobotsArenaEntity>>;
}