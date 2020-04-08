import { ArenaService } from "../ArenaService";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import { BotsService } from "../BotsService";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";

@Singleton
export class ArenaServiceImpl implements ArenaService {

    @Inject
    private factory: IServiceFactory;

    @Inject
    private botsService: BotsService;

    public async saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>
    {
        let botsArena : Array<RobotsArenaEntity> = await arena.robotArena;

        if (!botsArena){
            botsArena = [];
        }
        await this.deleteRobotArena(arena.id);
        for (let botArena of botsArena){
            await this.botsService.saveOrUpdate(botArena.robot);
            await this.factory.getBotsArenaRepository().save(botArena);
        }
        delete arena.robotArena;
        try {
            if (arena.id) {
                await this.factory.getArenaRepository().update(arena.id, arena);
                arena.robotArena = Promise.resolve(botsArena);
                return (arena);
            }
            else {
                const saved = await this.factory.getArenaRepository().save(arena);
                    
                return (saved);
            }
        }
        catch (e){
            throw e;
        }
    }

    public async findOne(id: number): Promise<ArenaEntity>
    {
        return this.factory.getArenaRepository().createQueryBuilder("arena").leftJoinAndSelect("arena.robotArena", "robotArena").leftJoinAndSelect("robotArena.robot", "robot").where("arena.id = :id", {
            "id": id
        }).getOne();
    }

    public findAll(): Promise<Array<ArenaEntity>>
    {
        return this.factory.getArenaRepository().find();
    }

    public async deleteOne(id: number) : Promise<Boolean>
    {
        try {
            const arena = await this.factory.getArenaRepository().findOne(id);

            if (arena){
                await this.deleteRobotArena(arena.id);
                await this.factory.getArenaRepository().delete(arena.id);

                return (true);
            }
            return (false);
        }
        catch (e){
            return (false);
        }
    }

    public async disable(id: number): Promise<Boolean>
    {
        try {
            const arena: ArenaEntity = await this.factory.getArenaRepository().findOne(id);
            const toUpdate = new ArenaEntity();

            toUpdate.arena_name = arena.arena_name;
            toUpdate.available = 0;
            toUpdate.id = arena.id;
            await this.factory.getArenaRepository().update(toUpdate.id, toUpdate);
            return (true);
        }
        catch (e){
            throw e;
        }
    }

    public async enable(id: number): Promise<Boolean>
    {
        try {
            const arena: ArenaEntity = await this.factory.getArenaRepository().findOne(id);
            const toUpdate = new ArenaEntity();

            toUpdate.arena_name = arena.arena_name;
            toUpdate.available = 1;
            toUpdate.id = arena.id;
            await this.factory.getArenaRepository().update(toUpdate.id, toUpdate);
            return (true);
        }
        catch (e){
            throw e;
        }
    }

    public async deleteRobotArena(arenaId: number){
        await this.factory.getBotsArenaRepository().createQueryBuilder("robotarena").delete().where("arena_id = :arena_id", {
            arena_id: arenaId
        }).execute();
    }

    public async linkBot(arenaId: number, botId: number): Promise<ArenaEntity> {
        try {
            const arena = await this.findOne(arenaId);

            if (!arena){
                throw new EntityError(EEntityStatus.NOT_FOUND, "arena not found");
            }
            const bot = await this.botsService.findOne(botId);

            if (!bot){
                throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
            }
            const robotArena: RobotsArenaEntity = {};
            const robotsArena = await arena.robotArena;

            robotArena.arena = arena;
            robotArena.robot = bot;
            robotsArena.push(robotArena);
            await this.factory.getBotsArenaRepository().save(robotArena);
            arena.robotArena = Promise.resolve(robotsArena);
            return (arena);
        }
        catch (e){
            throw new EntityError(EEntityStatus.INTERNAL_ERROR, e.message);
        }
    }
}
