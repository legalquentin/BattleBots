import { GameService } from "../GameService";
import { Inject, Singleton, Container } from "typescript-ioc";
import IServiceFactory from "../IServiceFactory";
import { GameEntity } from "../../database/entities/GameEntity";
import { EGameStatus } from "../../resources/EGameStatus";
import { RobotGameEntity } from "../../database/entities/RobotGameEntity";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { IGameResource } from "../../resources/IGameResource";
import { SendResource } from "../../../lib/ReturnExtended";
import { GameResourceAsm } from "../../resources/asm/GameResourceAsm";

@Singleton
export class GameServiceImpl implements GameService {

    @Inject
    private serviceFactory: IServiceFactory;

    public async __linkArenaToGame(arenaId: number, gameId: number) {
        const arena = await this.serviceFactory.getArenaRepository().findOne(arenaId);

        if (!arena){
            throw new EntityError(EEntityStatus.NOT_FOUND, "arena not found");
        }
        const game = await this.serviceFactory.getGameRepository().findOne(gameId);

        if (!game){
            throw new EntityError(EEntityStatus.NOT_FOUND, "game not found");
        }
        game.arena = arena;
        await this.serviceFactory.getGameRepository().update(game.id, game);
        return (game);
    }

    public async linkArenaToGame(arenaId: number, gameId: number) {
        try {
            const game = await this.__linkArenaToGame(arenaId, gameId);
            const gameResourceAsm = Container.get(GameResourceAsm);
            const response = {
                httpCode: 200,
                data: await gameResourceAsm.toGameResource(game),
                message: `link arena ${arenaId} to game ${gameId}`
            };

            await gameResourceAsm.AddArenaResource(game, response.data);
            return (Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response)));
        }
        catch (e){
            const response = {
                httpCode: 400,
                message: e.message
            };

            const error: EntityError = e;
            if (error.code === EEntityStatus.NOT_FOUND){
                response.httpCode = 404;
            }
            return (Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response)));
        }
    }

    public async __linkStreamToGame(streamId: number, gameId: number) {
        const stream = await this.serviceFactory.getStreamsRepository().findOne(streamId);

        if (!stream){
            throw new EntityError(EEntityStatus.NOT_FOUND, "stream not found");
        }
        const game = await this.serviceFactory.getGameRepository().createQueryBuilder("games").leftJoinAndSelect("games.streams", "streams").getOne();

        if (!game){
            throw new EntityError(EEntityStatus.NOT_FOUND, "game not found");
        }
        const streams = await game.streams;
        if (streams){
            for (let s of streams){
                if (s.id === stream.id){
                    throw new EntityError(EEntityStatus.INTERNAL_ERROR, "already join");
                }
            }
            streams.push(stream);
        }
        stream.game = game;
        await this.serviceFactory.getStreamsRepository().update(stream.id, stream);
        game.streams = [stream];        
        return (game);
    }

    public async linkStreamToGame(streamId: number, gameId: number) {
        try {
            const gameResourceAsm = Container.get(GameResourceAsm);
            const game  = await this.__linkStreamToGame(streamId, gameId);
            const response = {
                message: `link stream ${streamId} to game ${gameId}`,
                httpCode: 200,
                data: await gameResourceAsm.toResource(game)
            };

            gameResourceAsm.AddStreamResouce(game, response.data);
            return (Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response)));
        }
        catch (e){
            const response = {
                message: e.message,
                httpCode: 400
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response)));
        }
    }

    public async create(game: GameEntity): Promise<GameEntity> {
        game.game_status = EGameStatus.CREATED;
        return this.saveOrUpdate(game);
    }
 
    public async start(id: number): Promise<GameEntity> {
        const game = await this.__findOne(id);

        if (!game){
            return (null);
        }
        game.game_status = EGameStatus.STARTED;
        return this.saveOrUpdate(game);
    }
    
    public async stop(id: number): Promise<GameEntity> {
        const game = await this.__findOne(id);

        if (!game){
            return (null);
        }
        game.game_status = EGameStatus.STOPPED;
        return this.saveOrUpdate(game);
    }

    public async end(id: number): Promise<GameEntity> {
        const game = await this.__findOne(id);

        if (!game){
            return (null);
        }
        game.game_status = EGameStatus.ENDED;
        return this.saveOrUpdate(game);
    }

    public async saveOrUpdate(game: GameEntity): Promise<GameEntity>
    {
        try {
                if (game.id){
                    await this.serviceFactory.getGameRepository().update(game.id, game);
                    return (game);
                }
                else {
                    const saved = await this.serviceFactory.getGameRepository().save(game);
        
                    return (saved);
                }
        }
        catch (e){
            throw e;
        }
    }

    public async deleteOne(id: number): Promise<Boolean> {
        try {
            const game = await this.serviceFactory.getGameRepository().findOne(id);
        
            if (game){
                await this.serviceFactory.getGameRepository().delete(game.id);
                return (true);
            }
            return (false);
        }
        catch (e){
            throw e;
        }
    }

    public async findAll(): Promise<Array<GameEntity>> {
        return (this.serviceFactory.getGameRepository().find());
    }

    public async __findOne(id: number): Promise<GameEntity> {
        return (this.serviceFactory.getGameRepository().
        createQueryBuilder("game").
        leftJoinAndSelect("game.robots", "robots").
        leftJoinAndSelect("robots.bot", "bot").
        leftJoinAndSelect("game.arena", "arena").
        leftJoinAndSelect("game.streams", "streams").
        leftJoinAndSelect("bot.player", "player").
        where("game.id = :game_id", {
            "game_id": id
        }).
        getOne());
    }

    public async findOne(id: number){
        try {
            const game = await this.__findOne(id);
            const gameResourceAsm = Container.get(GameResourceAsm);

            if (!game){
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: 404,
                    message: "game not found",
                };
        
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
            }
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: "game detail",
                data: await gameResourceAsm.toResource(game)
            };
            
            gameResourceAsm.AddStreamResouce(game, response.data);
            gameResourceAsm.AddArenaResource(game, response.data);
            gameResourceAsm.AddBotsResource(game, response.data);
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));            
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    public deleteAllBotGame(game: GameEntity){
        return (this.serviceFactory.getBotGameRepository().createQueryBuilder().delete().from(RobotGameEntity).where("game_id = :id", {
            "id": game.id
        }).execute());
    }

    public async __linkBotToGame(botId: number, gameId: number) {
        const bot = await this.serviceFactory.getBotsRepository().createQueryBuilder("robots").where("robots.id = :id", {
            id: botId
        }).getOne();

        if (!bot){
            throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
        }
        const game = await this.serviceFactory.getGameRepository().createQueryBuilder("games").where("games.id = :id", {
            id: gameId
        }).getOne();
        if (!game){
            throw new EntityError(EEntityStatus.NOT_FOUND, "game not found");
        }
        const robotGames = await game.robots;

        if (robotGames){
            for (let robotGame of robotGames){
                if (robotGame.bot === bot){
                    throw new EntityError(EEntityStatus.INTERNAL_ERROR, "already join")
                }
            }
        }
        const robotGame: RobotGameEntity = {
            bot: bot,
            game: game
        };
        await this.serviceFactory.getBotGameRepository().save(robotGame);
        return (game);
    }

    public async linkBotToGame(botId: number, gameId: number){
        try {
            const game = await this.__linkBotToGame(botId, gameId);
            const gameResourceAsm = Container.get(GameResourceAsm);
            const resource = await gameResourceAsm.toResource(game);
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: `link bot ${botId} to game ${gameId}`,
                data: resource
            };

            gameResourceAsm.AddBotsResource(game, response.data);
            return (Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response)));
        }
        catch (e){
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }
}
