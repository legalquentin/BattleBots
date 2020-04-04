import { ArenaService } from "../ArenaService";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import { BotsService } from "../BotsService";

@Singleton
export class ArenaServiceImpl implements ArenaService {

    @Inject
    private factory: IServiceFactory;

    @Inject
    private botsService: BotsService;

    public async saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>
    {
            try {
                let botsArena : Array<RobotsArenaEntity> = await arena.robotArena;

                if (!botsArena){
                    botsArena = [];
                }
                for (let botArena of botsArena){
                    await this.botsService.saveOrUpdate(botArena.robot);
                }
                if (arena.id) {
                    await this.factory.getArenaRepository().update(arena.id, arena);

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
        return this.factory.getArenaRepository().findOne(id);
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
                await this.factory.getArenaRepository().createQueryBuilder().delete().from(ArenaEntity).where("id = :id", {
                    id: arena.id
                }).execute();

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
}
