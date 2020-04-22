import { ArenaService } from "../ArenaService";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton, Container } from "typescript-ioc";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import { BotsService } from "../BotsService";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import { ArenaResourceAsm } from "../../resources/asm/ArenaResourceAsm";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { SendResource } from "../../../lib/ReturnExtended";
import { IArenaResource } from "../../resources/IArenaResource";

@Singleton
export class ArenaServiceImpl implements ArenaService {

    @Inject
    private factory: IServiceFactory;

    @Inject
    private botsService: BotsService;

    public async saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>
    {
        try {
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

    public async __linkBot(arenaId: number, botId: number): Promise<ArenaEntity> {
        try {
            const arena = await this.findOne(arenaId);

            if (!arena){
                throw new EntityError(EEntityStatus.NOT_FOUND, "arena not found");
            }
            const bot = await this.botsService.__findOne(botId);

            if (!bot){
                throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
            }
            let robotArenas: Array<RobotsArenaEntity> = await arena.robotArena;
            let robotArena : RobotsArenaEntity= {};
            robotArena.arena = arena;
            robotArena.robot = bot;
            robotArenas.push(robotArena);
            await this.factory.getBotsArenaRepository().save(robotArena);
            arena.robotArena = robotArenas;
            return (arena);
        }
        catch (e){
            throw new EntityError(EEntityStatus.INTERNAL_ERROR, e.message);
        }
    }

    public async linkBot(arenaId: number, botId: number) {
        const arenaResourceAsm = Container.get(ArenaResourceAsm);
        try {
            const arena = await this.__linkBot(arenaId, botId);
            const resource = await arenaResourceAsm.toResource(arena);
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 200,
                data: resource,
                message: `link bot ${botId} to arena ${arenaId}`
            };
            
            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }   
        catch (e){
            const response: HttpResponseModel<IArenaResource> = {
                httpCode: 400,
                message: e.message
            };
            
            if (e.code == EEntityStatus.NOT_FOUND){
                response.httpCode = 404;
            }
            return (Promise.resolve(new SendResource<HttpResponseModel<IArenaResource>>("ArenaController", response.httpCode, response)));
        }
    }
}
