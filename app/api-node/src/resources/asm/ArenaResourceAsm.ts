import { IArenaResource } from "../IArenaResource";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import { BotResourceAsm } from "../../resources/asm/BotResourceAsm";
import { Singleton, Inject } from "typescript-ioc";

@Singleton
export class ArenaResourceAsm {
    @Inject
    private botResourceAsm: BotResourceAsm;

    public async toEntity(resource: IArenaResource){
        const entity : ArenaEntity = {
            arena_name: resource.arena_name,
            available: resource.available,
            id: resource.id
        };

        if (!resource.bots){
            resource.bots = [];
        }
        await (async (resource, entity) => {
            try {
                for (let bot of resource.bots){
                    const botEntity = this.botResourceAsm.toEntity(bot);

                    await this.botResourceAsm.AddArenaEntity(botEntity, entity);
                }
            }
            catch (e){
                throw e;
            }
        })(resource, entity);
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
        let bots = await (async () => {
            let bots = [];

            for (let _robotArena of robotArena){
                bots.push(await this.botResourceAsm.toResource(_robotArena.robot));
            }
            return (bots);
        })();
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