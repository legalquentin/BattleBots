import { IGameResource } from "../IGameResource";
import { GameEntity } from "../../database/entities/GameEntity";
import { Singleton, Container } from "typescript-ioc";
import { StreamsResourceAsm } from "./StreamsResourceAsm";
import { ArenaResourceAsm } from "./ArenaResourceAsm";
import { GameUserEntity } from "../../database/entities/GameUserEntity";
import { PlayerResourceAsm } from "./PlayerResourceAsm";

@Singleton
export class GameResourceAsm {

    public async toEntity(game: IGameResource){
        const entity = new GameEntity();

        entity.id = game.id;
        entity.game_name = game.name;
        entity.game_status = game.status;
        if (game.startedAt){
            entity.started_at = new Date(game.startedAt);
        }
        if (game.endedAt){
            entity.ended_at = new Date(game.endedAt);
        }
        if (game.createdAt){
            entity.created_at = new Date(game.createdAt);
        }
        return (entity);
    }

    public toGameResource(entity: GameEntity) : IGameResource{
        const resource : IGameResource = {
            id: entity.id,
            name: entity.game_name,
            status: entity.game_status,
        };

        if (entity.started_at){
            resource.startedAt = entity.started_at.getTime();
        }
        if (entity.created_at){
            resource.createdAt = entity.created_at.getTime();
        }
        if (entity.ended_at){
            resource.endedAt = entity.ended_at.getTime();
        }
        return (resource);
    }

    public async AddArenaResource(entity: GameEntity, resource: IGameResource): Promise<IGameResource> {
        const arenaResourceAsm = Container.get(ArenaResourceAsm);

        if (entity.arena){
            resource.arena = await arenaResourceAsm.toResource(entity.arena);
            await arenaResourceAsm.addBotResource(entity.arena, resource.arena);
        }
        return (resource);
    }

    public async AddStreamResouce(entity: GameEntity, resource: IGameResource): Promise<IGameResource> {
        const streamResourceAsm = Container.get(StreamsResourceAsm);
        const entitiesStreams = await entity.streams;

        if (entitiesStreams){
            const streams = [];

            for (let stream of entitiesStreams){
                streams.push(await streamResourceAsm.toResource(stream));
            }
            resource.streams = streams;
        }
        return (resource);
    } 

    public async AddGamesUsersInGameResource(gameUsers: Array<GameUserEntity>, resource: IGameResource){
        const playerResourceAsm = Container.get(PlayerResourceAsm);
        resource.players = [];

        if (gameUsers){
            for (let gameUser of gameUsers){
                const user = gameUser.user;

                resource.players.push(await playerResourceAsm.toResource(user));
            }
        }
        return (resource);
    }

    public async toResource(entity: GameEntity){
        const resource : IGameResource = this.toGameResource(entity);

        return (resource);
    }

    public async toResources(games: Array<GameEntity>){
        const resources = [];

        for (let game of games){
            const resource = await this.toResource(game);
            const gameUsers = await game.gameUsers;
            await this.AddGamesUsersInGameResource(gameUsers, resource);
            resources.push(resource);
        }
        return (resources);
    }
}  