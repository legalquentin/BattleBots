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
import { SessionEntity } from "../entities/SessionEntity";
import { StreamsEntity } from "../entities/StreamsEntity";
import { GameUserEntity } from "../entities/GameUserEntity";
import { RobotGameEntity } from "../entities/RobotGameEntity";

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
            leftJoinAndSelect("game.sessions", "sessions").
            leftJoinAndSelect("sessions.player", "player_session").
            leftJoinAndSelect("sessions.bot", "bot_session").
            leftJoinAndSelect("sessions.game", "game_session").
            leftJoinAndSelect("sessions.stream", "stream_session").
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
            leftJoinAndSelect("game.sessions", "sessions").
            leftJoinAndSelect("sessions.player", "player_session").
            leftJoinAndSelect("sessions.bot", "bot_session").
            leftJoinAndSelect("sessions.game", "game_session").
            leftJoinAndSelect("sessions.stream", "stream_session").
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

    public async AddSessionInGame(manager: EntityManager, game: GameEntity, sessions: Array<SessionEntity>){
        await manager.getCustomRepository(SessionRepository).deleteAllByGame(game);

        if (sessions && sessions.length) {
            for (let session of sessions) {
                session.game = game;
                console.log("SAVING SESSION", session)
                const ret = await manager.getCustomRepository(SessionRepository).save(session);
                console.log("SESSION SAVED", ret)
            }
        }
    }

    public async AddStreamInGame(manager: EntityManager, game: GameEntity, streams: Array<StreamsEntity>){
        await manager.getCustomRepository(StreamsRepository).deleteByGame(game);
        
        if (streams && streams.length) {
            for (let stream of streams) {
                stream.id = null;
                stream.game = game;
                console.log("SAVING STREAM", stream)
                const ret = await manager.getCustomRepository(StreamsRepository).save(stream);
                console.log("STREAM SAVED", ret)
            }
        }
    }

    public async AddBotGame(manager: EntityManager, game: GameEntity, botGames: Array<RobotGameEntity>){
        await manager.getCustomRepository(BotGameRepository).deleteAllBotGame(game);

        if (botGames && botGames.length) {
            for (let botGame of botGames) {
                botGame.game = game;
                await manager.getCustomRepository(BotsRepository).save(botGame.bot);
                await manager.getCustomRepository(BotGameRepository).save(botGame);
            }
        }
    }

    public async AddUserGame(manager: EntityManager, game: GameEntity, userGames: Array<GameUserEntity>){
        await manager.getCustomRepository(UserGameRepository).deleteByGame(game);

        if (userGames && userGames.length) {
            for (let userGame of userGames) {
                userGame.game = game;
                console.log("SAVING USERGAME", userGame)
                await manager.getCustomRepository(UserGameRepository).save(userGame);
            }
        }
    }

    public async saveOrUpdate(manager: EntityManager, game: GameEntity): Promise<GameEntity> {
        console.log("SAVING GAME", game)
        const r = await manager.save(game);
        console.log("GAME SAVED", r);
        return (r);
    }

    public async deleteGame(game: GameEntity){
        const manager = getManager(connectionName());

        await manager.getCustomRepository(SessionRepository).deleteAllByGame(game);
        await manager.getCustomRepository(BotGameRepository).deleteAllBotGame(game);
        await manager.getCustomRepository(StreamsRepository).deleteByGame(game);
        await manager.getCustomRepository(UserGameRepository).deleteByGame(game);
        await manager.delete(GameEntity, game.id);
    }
}
