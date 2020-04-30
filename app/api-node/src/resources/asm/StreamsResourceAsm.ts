import { IStreamResource } from "../IStreamResource";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
//import { BotResourceAsm } from "./BotResourceAsm";
//import { GameResourceAsm } from "./GameResourceAsm";
import { Singleton /*, Container */ } from "typescript-ioc";

@Singleton
export class StreamsResourceAsm {
    /*
    botResourceAsm: BotResourceAsm;
    gameResourceAsm: GameResourceAsm;
    */

    constructor(){
        /*
        this.botResourceAsm = Container.get(BotResourceAsm);
        this.gameResourceAsm = Container.get(GameResourceAsm);
        */
    }

    public async toEntity(resource: IStreamResource){
        const streamEntity = new StreamsEntity();

        streamEntity.kinesisUrl = resource.kinesisUrl;
        streamEntity.s3Url = resource.s3Url;
        streamEntity.private = resource.private;
        streamEntity.running = resource.running;
        streamEntity.duration = resource.duration;
        streamEntity.encodage = resource.encodage;
        /*
        if (resource.robot){
            streamEntity.robot = await this.botResourceAsm.toEntity(resource.robot);
        }
        if (resource.game){
            streamEntity.game = await this.gameResourceAsm.toEntity(resource.game);
        }
        */
        return (streamEntity);
    }

    public async toResource(entity: StreamsEntity){
        const streamResource : IStreamResource = {
            kinesisUrl: entity.kinesisUrl,
            s3Url: entity.s3Url,
            private: entity.private,
            running: entity.running,
            duration: entity.duration,
            encodage: entity.encodage,
            id: entity.id
        };
        /*
        if (entity.robot){
            const bot = await this.botResourceAsm.toResource(entity.robot);
    
            streamResource.robot = bot;
        }
        if (entity.game){
            const game = await this.gameResourceAsm.toResource(entity.game);
  
            streamResource.game = game;
        }
        */
        return (streamResource);
    }

    public async toResources(list: Array<StreamsEntity>){
        const resources = [];

        for (let entity of list){
            resources.push(await this.toResource(entity));
        }
        return (resources);
    }
}