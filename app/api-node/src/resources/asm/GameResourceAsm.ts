import { IGameResource } from "../IGameResource";
import { GameEntity } from "../../database/entities/GameEntity";
import { Inject, Singleton } from "typescript-ioc";
import { ArenaResourceAsm } from "./ArenaResourceAsm";
import { BotResourceAsm } from "./BotResourceAsm";
import { RobotGameEntity } from "../../database/entities/RobotGameEntity";
import { StreamsResourceAsm } from "./StreamsResourceAsm";

@Singleton
export class GameResourceAsm {

    @Inject
    private arenaResourceAsm: ArenaResourceAsm;

    @Inject
    private botResourceAsm: BotResourceAsm;

    @Inject
    private streamResourceAsm: StreamsResourceAsm;

    public async toEntity(game: IGameResource){
        const entity = new GameEntity();

        entity.id = game.id;
        entity.game_name = game.name;
        entity.game_status = game.status;
        let gameRobots = [];
        if (game.arena){
            entity.arena = await this.arenaResourceAsm.toEntity(game.arena);
        }
        if (game.bots){
            for (let bot of game.bots){
                let gameRobot : RobotGameEntity = {};


                gameRobot.bot = await this.botResourceAsm.toEntity(bot);
                gameRobot.game = entity;
                gameRobots.push(gameRobot);
            }
            entity.robots = Promise.resolve(gameRobots);
        }
        if (game.streams){
            let streams = [];

            for (let stream of game.streams){
                const streamResource = this.streamResourceAsm.toEntity(stream);

                streams.push(streamResource);
            }
            entity.streams = Promise.resolve(streams);
        }
        return (entity);
    }

    public async toResource(entity: GameEntity){
        const resource : IGameResource = {
            id: entity.id,
            name: entity.game_name,
            status: entity.game_status,
            bots: []
        };
        let botsGames = await entity.robots;

        if (!botsGames){
            botsGames = [];
        }
        for (let botGame of botsGames)
        {
            const bot = botGame.bot;
            const botResource = await this.botResourceAsm.toResource(bot);

            resource.bots.push(botResource);
        }
        resource.arena = await this.arenaResourceAsm.toResource(entity.arena);
        resource.streams = [];
        const streams = await entity.streams;
        for (let stream of streams){
            resource.streams.push(await this.streamResourceAsm.toResource(stream));
        }
        return (resource);
    }

    public async toResources(games: Array<GameEntity>){
        const resources = [];

        for (let game of games){
            resources.push(await this.toResource(game));
        }
        return (resources);
    }
}  