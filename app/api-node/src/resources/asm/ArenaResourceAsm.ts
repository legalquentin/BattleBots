import { IArenaResource } from "../IArenaResource";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import { BotResourceAsm } from "../../resources/asm/BotResourceAsm";
import { Singleton, Inject } from "typescript-ioc";
import { BotArenaService } from "../../service/BotArenaService";

@Singleton
export class ArenaResourceAsm {

    @Inject
    private botArenaService: BotArenaService;

    @Inject
    private botResourceAsm: BotResourceAsm;

    public async toEntity(resource: IArenaResource){
        const entity : ArenaEntity = {
            arena_name: resource.arena_name,
            available: resource.available,
            id: resource.id
        };
        const robotArena = (async (resource, entity) => {
            try {
                const botsArena = [];

                if (!resource.bots){
                    resource.bots = [];
                }
                for (let bot of resource.bots){
                    let botArena = await this.botArenaService.findOne(bot.id, entity.id);
    
                    if (!botArena){
                        botArena = {};

                        botArena.arena = entity;
                        botArena.robot = this.botResourceAsm.toResource(bot);
                    }
                    botsArena.push(botArena);
                }
                return (botsArena);
            }
            catch (e){
                throw e;
            }
        })(resource, entity);
        entity.robotArena = robotArena;
        return (entity);
    }

    public async toResource(entity: ArenaEntity){
        const resource: IArenaResource = {
            arena_name: entity.arena_name,
            available: entity.available,
            id: entity.id
        };
        let robotArena = await entity.robotArena;
        if (!robotArena){
            robotArena = [];
        }
        const bots = robotArena.map(botArena => {
            return this.botResourceAsm.toResource(botArena.robot);
        });

        resource.bots = bots;
        return (resource);
    }

    public async toResources(entities: Array<ArenaEntity>){
        const resources = (async () =>  {
            let resources = [];

            for (let entity of entities){
                resources.push(await this.toResource(entity));   
            }

            return (resources);
        })();

        return (resources);
    }
}