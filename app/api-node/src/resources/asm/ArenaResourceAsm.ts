import { IArenaResource } from "../IArenaResource";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import { Singleton } from "typescript-ioc";
//import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";

@Singleton
export class ArenaResourceAsm {
//    private botResourceAsm: BotResourceAsm;

    constructor(){
//        this.botResourceAsm = Container.get(BotResourceAsm);
    }

    public async toEntity(resource: IArenaResource){
        const entity = new ArenaEntity();

        entity.arena_name = resource.arena_name;
        entity.available = resource.available;
        entity.id = resource.id;
        /*
        if (!resource.bots){
            resource.bots = [];
        }
        await (async (resource, entity) => {
            try {
                for (let bot of resource.bots){
                    const botEntity = await this.botResourceAsm.toEntity(bot);

                    await this.botResourceAsm.AddArenaEntity(botEntity, entity);
                }
            }
            catch (e){
                throw e;
            }
        })(resource, entity);
        */
        return (entity);
    }

    public async toResource(entity: ArenaEntity){
        const resource: IArenaResource = {
            arena_name: entity.arena_name,
            available: entity.available,
            id: entity.id
        };

        /*
        let robotsArena: Array<RobotsArenaEntity> = await entity.robotArena;
        if (!this.botsArenaIsInitialized(robotsArena)){
            robotsArena = [];
        }
        let bots = await (async () => {
            let bots = [];

            for (let _robotArena of robotsArena){
                bots.push(await this.botResourceAsm.toResource(_robotArena.robot));
            }
            return (bots);
        })();
        resource.bots = bots;
        */
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

    /*
    private botsArenaIsInitialized(botsArena: Array<RobotsArenaEntity>){
        return (botsArena.length > 0 && botsArena[0].robot != null);
    }
    */
}