import { IArenaResource } from "../IArenaResource";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import { Singleton, Container } from "typescript-ioc";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import { BotResourceAsm } from "./BotResourceAsm";
//import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";

@Singleton
export class ArenaResourceAsm {

    public async toEntity(resource: IArenaResource){
        const entity = new ArenaEntity();

        entity.arena_name = resource.arena_name;
        entity.available = resource.available;
        entity.id = resource.id;
        return (entity);
    }

    public async toResource(entity: ArenaEntity){
        const resource: IArenaResource = {
            arena_name: entity.arena_name,
            available: entity.available,
            id: entity.id
        };

        return (resource);
    }

    public async addBotResource(entity: ArenaEntity, resource: IArenaResource){
        const botResourceAsm = Container.get(BotResourceAsm);
        let robotsArena: Array<RobotsArenaEntity> = await entity.robotArena;
        let bots = await (async () => {
            let bots = [];

            for (let _robotArena of robotsArena){
                bots.push(await botResourceAsm.toResource(_robotArena.robot));
            }
            return (bots);
        })();
        resource.bots = bots;
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