import { ArenaService } from "../ArenaService";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import { BotsService } from "../BotsService";
import { BotArenaRepository } from "../../database/repositories/BotArenaRepository";

@Singleton
export class ArenaServiceImpl implements ArenaService {

    @Inject
    private factory: IServiceFactory;

    @Inject
    private botsService: BotsService;

    @Inject
    private botArenaRepository: BotArenaRepository;

    public async saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>
    {
            try {
                if (arena.id) {
                    let botsArena : Array<RobotsArenaEntity> = await arena.robotArena;

                    if (!botsArena){
                        botsArena = [];
                    }
                    await this.deleteRobotArena(arena.id);
                    for (let botArena of botsArena){
                        if (await this.botsService.findOne(botArena.robot.id) == null){
                            await this.botsService.saveOrUpdate(botArena.robot);
                        }
                        await this.botArenaRepository.save(botArena);
                    }
                    delete arena.robotArena;
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
            const toUpdate: ArenaEntity = {
                arena_name: arena.arena_name,
                available: 0,
                id: arena.id
            };

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
            const toUpdate: ArenaEntity = {
                arena_name: arena.arena_name,
                available: 1,
                id: arena.id
            };

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
}
