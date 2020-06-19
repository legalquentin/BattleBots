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
        const playerResourceAsm = Container.get(PlayerResourceAsm);
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
        if (game.players){
            let gameUsers = [];

            for (let player of game.players){
                const gameUser = new GameUserEntity();
                const user = await playerResourceAsm.toEntity(player);
                gameUser.game = entity;
                gameUser.user = user;

                gameUsers.push(gameUser);
            }
            entity.gameUsers = gameUsers;
        }
        /*
        if (game.streams){
            entity.streams = [];
            const streams = await game.streams;

            for (let stream of game.streams){
                const entityStream = await streamResourceAsm.toEntity(stream);
                
                entity.streams.push(entityStream);
            }
        }
        */
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
            //resource.streams = streams;
        }
        return (resource);
    } 

    public async AddGamesUsersInGameResource(gameUser: GameUserEntity, resource: IGameResource){
        const playerResourceAsm = Container.get(PlayerResourceAsm);
        if (!resource.players){
            resource.players = [];
        }
        const player = await playerResourceAsm.toResource(gameUser.user);
        resource.players.push(player);
        return (player);
    }

    public async toResource(entity: GameEntity){
        const resource : IGameResource = this.toGameResource(entity);

        return (resource);
    }

    public async toResources(games: Array<GameEntity>){
        const resources = [];

        for (let game of games){
            const resource = await this.toResource(game);
            resources.push(resource);
        }
        return (resources);
    }
}  