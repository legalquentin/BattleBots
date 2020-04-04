import { IGameResource } from "../IGameResource";
import { GameEntity } from "../../database/entities/GameEntity";
import { ArenaService } from "../../service/ArenaService";
import { Inject, Singleton } from "typescript-ioc";

@Singleton
export class GameResourceAsm {

    @Inject
    private arenaService: ArenaService;

    public async toEntity(game: IGameResource){
        const entity : GameEntity = {
            id: game.id,
            game_name: game.name,
            game_status: game.status,
        };

        if (game.arenaId){
            entity.arena = await this.arenaService.findOne(game.arenaId)
        }
        return (entity);
    }

    public toResource(entity: GameEntity){
        const resource : IGameResource = {
            id: entity.id,
            name: entity.game_name,
            status: entity.game_status,
        };

        if (entity.arena){
            resource.arenaId = entity.arena.id;
        }
        return (resource);
    }

    public toResources(games: Array<GameEntity>){
        return games.map((entity) => this.toResource(entity))     
    }
}  