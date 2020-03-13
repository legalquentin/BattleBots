import { ArenaService } from "../ArenaService";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";

@Singleton
export class ArenaServiceImpl implements ArenaService {

    @Inject
    private factory: IServiceFactory;

    public async saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>
    {
        if (arena.id) {
            try {
                const toFind = await this.factory.getArenaRepository().findOne(arena.id);

                toFind.arena_name = arena.arena_name;
                toFind.available = arena.available;
                await this.factory.getArenaRepository().update(toFind.id, toFind);
                return toFind;
            }
            catch (e){
                return Promise.reject(e.message);
            }
        }
        else {
            try {
                await this.factory.getArenaRepository().save(arena);
                return Promise.resolve(arena);
            }
            catch (e){
                return Promise.reject(null);
            }
        }
    }

    public async findOne(id: number): Promise<ArenaEntity>
    {
        try {
            const arena = await this.factory.getArenaRepository().findOne(id);

            return (Promise.resolve(arena));
        }
        catch (e){
            return (Promise.reject(e.message));
        }
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
                await this.factory.getArenaRepository().delete(arena);

                return (true);
            }
            return (false);
        }
        catch (e){
            return (false);
        }
    }
}
