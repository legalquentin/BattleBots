import { Repository, EntityRepository, EntityManager, EntityMetadata, getManager, getConnection } from "typeorm";
import { RobotsArenaEntity } from "../entities/RobotsArenaEntity";
import { Singleton, Container } from "typescript-ioc";
import { ArenaEntity } from "../entities/ArenaEntity";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import { BotsRepository } from "./BotsRepository";
import { ArenaRepository } from "./ArenaRepository";

@Singleton
@EntityRepository(RobotsArenaEntity)
export class BotArenaRepository extends Repository<RobotsArenaEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(RobotsArenaEntity);
    }

    public async linkBot(arenaId: number, botId: number): Promise<ArenaEntity> {
        const botRepository = Container.get(BotsRepository);
        const arenaRepository = Container.get(ArenaRepository);

        try {
            const arena = await arenaRepository.findOne(arenaId);

            if (!arena){
                throw new EntityError(EEntityStatus.NOT_FOUND, "arena not found");
            }
            const bot = await botRepository.findOne(botId);

            if (!bot){
                throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
            }
            let robotArenas: Array<RobotsArenaEntity> = await arena.robotArena;
            let robotArena : RobotsArenaEntity= {};
            robotArena.arena = arena;
            robotArena.robot = bot;
            robotArenas.push(robotArena);
            await this.save(robotArena);
            arena.robotArena = robotArenas;
            return (arena);
        }
        catch (e){
            throw new EntityError(EEntityStatus.INTERNAL_ERROR, e.message);
        }
    }

    public async deleteRobotArena(arenaId: number){
        await this.createQueryBuilder("robotarena").delete().where("arena_id = :arena_id", {
            arena_id: arenaId
        }).execute();
    }
}
