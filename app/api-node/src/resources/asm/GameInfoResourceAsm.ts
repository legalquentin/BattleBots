import { Singleton, Container } from "typescript-ioc";
import { IGameInfoResource } from "../IGameInfoResource";
import { GameInfoEntity } from "../../database/entities/GameInfoEntity";
import { GameResourceAsm } from "./GameResourceAsm";
import UserEntity from "../../database/entities/UserEntity";

@Singleton
export class GameInfoResourceAsm {
    async toEntity(resource: IGameInfoResource){
        const gameResourceAsm = Container.get(GameResourceAsm);
        const entity = new GameInfoEntity();

        if (resource.game){
            entity.game = await gameResourceAsm.toEntity(resource.game);
        }
        entity.winner = new UserEntity();
        entity.loser = new UserEntity();
        entity.winner.id = resource.winner_id;
        entity.loser.id = resource.loser_id;
        entity.winnerpoints = resource.winnerpoints;
        entity.loserpoints = resource.loserpoints;
        entity.video_loser = resource.video_loser;
        entity.video_winner = resource.video_winner;
        entity.id = resource.id;
        return (entity);
    }

    async toResource(entity: GameInfoEntity){
        const gameResourceAsm = Container.get(GameResourceAsm);
        const resource : IGameInfoResource = {};

        if (entity.game){
            resource.game = await gameResourceAsm.toResource(entity.game);
        }
        if (entity.winner){
            resource.winner_id = entity.winner.id;
        }
        if (entity.loser){
            resource.loser_id = entity.loser.id;
        }
        resource.winnerpoints = entity.winnerpoints;
        resource.loserpoints = entity.loserpoints;
        resource.video_loser = entity.video_loser;
        resource.video_winner = entity.video_winner;
        resource.id = entity.id;
        return (resource);
    }

    async toResources(entities: Array<GameInfoEntity>){
        const resources = [];

        for (let gameInfo of entities){
            const resource = await this.toResource(gameInfo);
            
            resources.push(resource);
        }
        return (resources);
    }
}