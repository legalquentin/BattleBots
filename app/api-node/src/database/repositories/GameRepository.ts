import { Repository, getManager, getConnection, EntityManager, EntityMetadata, EntityRepository } from "typeorm";
import { Singleton, Container } from "typescript-ioc";
import { GameEntity } from "../entities/GameEntity";
import { StreamsRepository } from "./StreamsRepository";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import { ArenaRepository } from "./ArenaRepository";
import { connectionName } from "../../service/util/connectionName";
import { BotGameRepository } from "./BotGameRepository";
import { BotsRepository } from "./BotsRepository";
import { SessionRepository } from "./SessionRepository";
import { UserGameRepository } from "./UserGameRepository";

@EntityRepository(GameEntity)
@Singleton
export class GameRepository extends Repository<GameEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor() {
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(GameEntity);
    }

    public list() {
        return (this.
            createQueryBuilder("game").
            leftJoinAndSelect("game.gameUsers", "gameUser").
            leftJoinAndSelect("gameUser.user", "user").
            leftJoinAndSelect("user.robotsUser", "robotsUser").
            leftJoinAndSelect("robotsUser.robot", "bot_user").
            leftJoinAndSelect("game.robots", "robots").
            leftJoinAndSelect("robots.bot", "bot", "bot_user.id = bot.id").
            leftJoinAndSelect("bot.streams", "streams_1").
            leftJoinAndSelect("game.arena", "arena").
            leftJoinAndSelect("arena.robotArena", "robotArena").
            leftJoinAndSelect("robotArena.robot", "robot", "robot.id = bot_user.id").
            leftJoinAndSelect("bot_user.streams", "streams_2").
            getMany());
    }

    public getOne(id: number) {
        return (this.
            createQueryBuilder("game").
            leftJoinAndSelect("game.gameUsers", "gameUser").
            leftJoinAndSelect("gameUser.user", "user").
            leftJoinAndSelect("user.robotsUser", "robotsUser").
            leftJoinAndSelect("robotsUser.robot", "bot_user").
            leftJoinAndSelect("game.robots", "robots").
            leftJoinAndSelect("robots.bot", "bot", "bot_user.id = bot.id").
            leftJoinAndSelect("bot.streams", "streams_1").
            leftJoinAndSelect("game.arena", "arena").
            leftJoinAndSelect("arena.robotArena", "robotArena").
            leftJoinAndSelect("robotArena.robot", "robot", "robot.id = bot.id").
            leftJoinAndSelect("bot_user.streams", "streams_2").
            where("game.id = :game_id", {
                "game_id": id
            }).
            getOne());
    }

    public async linkStreamToGame(streamId: number, gameId: number) {
        const streamRepository = Container.get(StreamsRepository);
        const gameRepository = Container.get(GameRepository);
        const stream = await streamRepository.findOne(streamId);

        if (!stream) {
            throw new EntityError(EEntityStatus.NOT_FOUND, "stream not found");
        }
        const game = await gameRepository.createQueryBuilder("games").leftJoinAndSelect("games.streams", "streams").where("games.id = :id", {
            "id": gameId
        }).getOne();

        if (!game) {
            throw new EntityError(EEntityStatus.NOT_FOUND, "game not found");
        }
        const streams = await game.streams;
        if (streams) {
            for (let s of streams) {
                if (s.id === stream.id) {
                    throw new EntityError(EEntityStatus.INTERNAL_ERROR, "already join");
                }
            }
            streams.push(stream);
            stream.game = game;
            game.streams = streams;
        }
        else {
            stream.game = game;
            game.streams = [stream];
        }
        await streamRepository.update(stream.id, stream);
        return (game);
    }

    async linkArenaToGame(arenaId: number, gameId: number) {
        const arenaRepository = Container.get(ArenaRepository);
        const arena = await arenaRepository.findOne(arenaId);

        if (!arena) {
            throw new EntityError(EEntityStatus.NOT_FOUND, "arena not found");
        }
        const game = await this.findOne(gameId);
        console.log(game);
        if (!game) {
            throw new EntityError(EEntityStatus.NOT_FOUND, "game not found");
        }
        game.arena = arena;
        await this.update(game.id, game);
        return (game);
    }

    public async saveOrUpdate(game: GameEntity): Promise<GameEntity> {
        const manager = getManager(connectionName());

        // return getManager(connectionName()).transaction(async (manager : EntityManager) => {
        try {
            console.log("initialize");
            const botGames = await game.robots;
            const streams = await game.streams;
            const sessions = await game.sessions;
            const userGames = await game.gameUsers;

            console.log("USERGAME", userGames);
            await manager.getCustomRepository(SessionRepository).deleteAllByGame(game);
            await manager.getCustomRepository(BotGameRepository).deleteAllBotGame(game);
            await manager.getCustomRepository(StreamsRepository).deleteByGame(game);
            await manager.getCustomRepository(UserGameRepository).deleteByGame(game.id);
            console.log("DEBUG-2");

            /*
            if (savedBotUsers){
                for (let savedBotUser of savedBotUsers){
                    await manager.getCustomRepository(RobotsUserRepository).delete(savedBotUser);
                }
            }
            */
            let r = game;
            if (game.id) {
                 await manager.update(GameEntity, game.id, game);
            }
            else {
                console.log("SAVING GAME", game)
                r = await manager.save(game);
                console.log("GAME SAVED", r)
            }


            console.log("update");
            if (botGames && botGames.length) {
                for (let botGame of botGames) {
                    botGame.game = r;
                    if (!botGame.bot.id) {
                        await manager.getCustomRepository(BotsRepository).save(botGame.bot);
                    }
                    else {
                        await manager.getCustomRepository(BotsRepository).save(botGame.bot);
                        // await manager.getCustomRepository(BotsRepository).update(botGame.bot.id, botGame.bot);
                    }
                    await manager.getCustomRepository(BotGameRepository).save(botGame);
                }
            }
            console.log("DEBUG-3")


            let usergamearr = []
            if (userGames && userGames.length) {
                for (let userGame of userGames) {
                    userGame.game = r;
                    console.log("SAVING USERGAME", userGame)
                    usergamearr.push(await manager.getCustomRepository(UserGameRepository).save(userGame));
                    // console.log("USERGAME SAVED", res)
                }
            }

            if (sessions && sessions.length) {
                for (let session of sessions) {
                    session.game = r;
                    console.log("SAVING SESSION", session)
                    const ret = await manager.getCustomRepository(SessionRepository).save(session);
                    console.log("SESSION SAVED", ret)
                }
            }
            if (streams && streams.length) {
                for (let stream of streams) {
                    stream.id = null;
                    stream.game = r;
                    console.log("SAVING STREAM", stream)
                    const ret = await manager.getCustomRepository(StreamsRepository).save(stream);
                    console.log("STREAM SAVED", ret)
                }
            }
            return (game);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        //  });
    }
}
