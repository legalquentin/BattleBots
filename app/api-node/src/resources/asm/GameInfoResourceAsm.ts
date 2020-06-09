import { Singleton, Container } from "typescript-ioc";
import { IGameInfoResource } from "../IGameInfoResource";
import { GameInfoEntity } from "../../database/entities/GameInfoEntity";
import { GameProfileResourceAsm } from "./GameProfileResourceAsm";
import { GameResourceAsm } from "./GameResourceAsm";

@Singleton
export class GameInfoResourceAsm {
    async toEntity(resource: IGameInfoResource){
        const gameProfileResourceAsmm = Container.get(GameProfileResourceAsm);
        const gameResourceAsm = Container.get(GameResourceAsm);
        const entity = new GameInfoEntity();

        if (resource.game){
            entity.game = await gameResourceAsm.toEntity(resource.game);
        }
        entity.gameended_at = resource.gameended_at;
        entity.gamestarted_at = resource.gamestarted_at;
        if (resource.winner){
            entity.winner = gameProfileResourceAsmm.toEntity(resource.winner);
        }
        if (resource.loser){
            entity.loser = gameProfileResourceAsmm.toEntity(resource.loser);
        }
        entity.winnerpoints = resource.winnerpoints;
        entity.loserpoints = resource.loserpoints;
        entity.video_loser = resource.video_loser;
        entity.video_winner = resource.video_winner;
        return (entity);
    }

    async toResource(entity: GameInfoEntity){
        const gameProfileResourceAsmm = Container.get(GameProfileResourceAsm);
        const gameResourceAsm = Container.get(GameResourceAsm);
        const resource : IGameInfoResource = {};

        if (entity.game){
            resource.game = await gameResourceAsm.toResource(entity.game);
        }
        if (entity.loser){
            resource.loser = await gameProfileResourceAsmm.toResource(entity.loser);
        }
        if (entity.winner){
            resource.winner = await gameProfileResourceAsmm.toResource(entity.winner);
        }
        resource.gameended_at = entity.gameended_at;
        resource.gamestarted_at = entity.gamestarted_at;
        resource.winnerpoints = entity.winnerpoints;
        resource.loserpoints = entity.loserpoints;
        resource.video_loser = entity.video_loser;
        resource.video_winner = entity.video_winner;
        resource.created_at = entity.createdAt;
        resource.updated_at = entity.updatedAt;
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