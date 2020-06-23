import { GameService } from "../GameService";
import { Inject, Singleton, Container } from "typescript-ioc";
import IServiceFactory from "../IServiceFactory";
import { EGameStatus } from "../../resources/EGameStatus";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { IGameResource } from "../../resources/IGameResource";
import { SendResource } from "../../../lib/ReturnExtended";
import { GameResourceAsm } from "../../resources/asm/GameResourceAsm";
import IBattleWorkerService from "../IBattleWorkerService";
import { IPlayerResource } from "../../resources/IPlayerResource";
import { UserResourceAsm } from "../../resources/asm/UserResourceAsm";
import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { SessionResourceAsm } from "../../resources/asm/SessionResourceAsm";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import { StreamsService } from "../StreamsService";
import IConfig from "../IConfig";
import { uuid } from "uuidv4";
import * as path from "path";
import * as fs from "fs";
import { PlayerResourceAsm } from "../../resources/asm/PlayerResourceAsm";
import { BotResourceAsm } from "../../resources/asm/BotResourceAsm";
import { RobotGameEntity } from "../../database/entities/RobotGameEntity";
import { SessionEntity } from "../../database/entities/SessionEntity";
import { GameUserEntity } from "../../database/entities/GameUserEntity";
import { RobotsUserEntity } from "../../database/entities/RobotsUserEntity";
import { StreamsResourceAsm } from "../../resources/asm/StreamsResourceAsm";

@Singleton
export class GameServiceImpl implements GameService {

    @Inject
    private serviceFactory: IServiceFactory;

    @Inject
    private battleWorkerService: IBattleWorkerService;

    @Inject
    private config: IConfig;

    @Inject
    private streamService: StreamsService;

    public async updateByWorker(game: IGameResource) {
        if (!game.id){
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                data: null,
                message: "ERROR"
            };

            return new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response);
        }
        const gameResourceAsm = Container.get(GameResourceAsm);
        const entity = await gameResourceAsm.toEntity(game);
        const manager = this.serviceFactory.getGameRepository().manager;
        const updated = await this.serviceFactory.getGameRepository().saveOrUpdate(manager, entity);
        const response : HttpResponseModel<IGameResource> = {
            httpCode: 200,
            data: await gameResourceAsm.toResource(updated),
            message: "game updated"
        };
        return new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response);
    }

    public async saveOrUpdate(game: IGameResource) {
        if (!game.status){
            game.status = EGameStatus.CREATED;
        }
        const gameResourceAsm = Container.get(GameResourceAsm);
        const playerResourceAsm = Container.get(PlayerResourceAsm);
        const botResourceAsm = Container.get(BotResourceAsm);

        try {
            const httpCode = game.id ? 200 : 201;
            if (game.status == EGameStatus.CREATED && !game.createdAt){
                game.createdAt = new Date().getTime();
            }
            else if (game.status == EGameStatus.STARTED && !game.startedAt){
                game.startedAt = new Date().getTime();
            }
            else if (game.status == EGameStatus.ENDED && !game.endedAt){
                game.endedAt = new Date().getTime();
            }
            const entity = await gameResourceAsm.toEntity(game);
            let playersResource = game.players;
            if (!playersResource){
                playersResource = [];
            }
            for (let player of playersResource){
                const playerEntity = await playerResourceAsm.toEntity(player);

                await this.serviceFactory.getBotUserRepository().deleteByUser(playerEntity.id);
            }
            for (let player of playersResource){
                const robotEntity = await botResourceAsm.toEntity(player.botSpecs);
                await this.serviceFactory.getBotsRepository().save(robotEntity);
                const playerEntity = await playerResourceAsm.toEntity(player);
                const botUser = new RobotsUserEntity();    
            
                botUser.user = playerEntity;
                botUser.robot = robotEntity;
                await this.serviceFactory.getBotUserRepository().save(botUser);
            }
            const sessions = [];
            const streams = [];
            const params = [];
            for (let player of playersResource){
                const session = new SessionEntity();
                const streamEntity = new StreamsEntity();
                const robotEntity = await botResourceAsm.toEntity(player.botSpecs);
                const resolve_path = `${player.stream}`;
                const o = path.parse(resolve_path);
                const param :any= {};

                streamEntity.s3Url = player.stream;
                streamEntity.kinesisUrl = "kinesis.com";
                streamEntity.encodage = "ffmpeg";
                streamEntity.duration = 1;
                streamEntity.running = 1;
                streamEntity.private = 1;
                streamEntity.robot = robotEntity;
                session.player = await playerResourceAsm.toEntity(player);
                session.bot = robotEntity;
                session.stream = streamEntity;
                if (player.botContext){
                    session.botEnergy = player.botContext.energy;
                    session.botHeat = player.botContext.heat;
                }
                param.Key = `${uuid()}${o.ext}`,
                param.Bucket = this.config.getBucket(),
                param.Body = fs.createReadStream(resolve_path)
                params.push(param);
                streams.push(streamEntity);
                sessions.push(session);
            }
            if (game.status == EGameStatus.ENDED){
                const ret = await this.streamService.uploadAll(streams, params);

                console.log(ret);
            }
            const bots = [];
            const userGames = [];

            for (let playerResource of playersResource){
                const botGame = new RobotGameEntity();
                const userGame = new GameUserEntity();

                botGame.bot = await botResourceAsm.toEntity(playerResource.botSpecs);
                userGame.user = await playerResourceAsm.toEntity(playerResource);
                userGames.push(userGame);
                bots.push(botGame);
            }
            const manager = this.serviceFactory.getGameRepository().manager;
            const saved = await this.serviceFactory.getGameRepository().saveOrUpdate(manager, entity);
            try {
                await this.serviceFactory.getGameRepository().AddBotGame(manager, saved, bots);
            }
            catch (e){
                console.log(e.message);
            }
            try {
                await this.serviceFactory.getGameRepository().AddStreamInGame(manager, saved, streams);
            }
            catch (e){
                console.log(e.message);
            }
            try {
                await this.serviceFactory.getGameRepository().AddSessionInGame(manager, saved, sessions);
            }
            catch (e){
                console.log(e.message);
            }
            try {
                await this.serviceFactory.getGameRepository().AddUserGame(manager, saved, userGames);
            }
            catch (e){
                console.log(e.message);
            }
            const resource = await gameResourceAsm.toResource(saved);

            game.id = saved.id;
            if (game.status == EGameStatus.CREATED){
                const r = await this.battleWorkerService.startGoWorker(game);
                console.log(r);
                if (!r || !r.token || !r.game) {
                    const response: HttpResponseModel<IGameResource> = {
                        httpCode: 500,
                        message: JSON.stringify(r)
                    };
                    console.log("ERROR, DELETING THE GAME")
                    await this.deleteOne(game.id);
                    return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
                }
                resource.token = r.token;
                resource.secret = r.secret;
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: httpCode,
                    message: "game create",
                    data: resource
                };
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));   
            } else {
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: httpCode,
                    message: "game updated",
                    data: resource
                };
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));   
            }     
        }
        catch (e){
            console.log(e.message);
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: "Bad Request"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    public joinGame(gameId: number, userId: number) {
        return Promise.resolve(this.battleWorkerService.joinGame(gameId, userId));
    }

    public async linkArenaToGame(arenaId: number, gameId: number) {
        try {
            const game = await this.serviceFactory.getGameRepository().linkArenaToGame(arenaId, gameId);
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

    public async linkStreamToGame(streamId: number, gameId: number) {
        try {
            const gameResourceAsm = Container.get(GameResourceAsm);
            const game  = await this.serviceFactory.getGameRepository().linkStreamToGame(streamId, gameId);
            const response = {
                message: `link stream ${streamId} to game ${gameId}`,
                httpCode: 200,
                data: await gameResourceAsm.toResource(game)
            };

            await gameResourceAsm.AddStreamResouce(game, response.data);
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

    public async linkUserToGame(userId: number, gameId: number){
        try {
            const gameResourceAsm = Container.get(GameResourceAsm);
            const userGame  = await this.serviceFactory.getUserGameRepository().linkUserToGame(gameId, userId);
            const response = {
                message: `link user ${userId} to game ${gameId}`,
                httpCode: 200,
                data: await gameResourceAsm.toResource(userGame.game)
            };

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

    public async deleteOne(id: number) {
        try {
            const game = await this.serviceFactory.getGameRepository().findOne(id);

            if (game !== null){
                const response: HttpResponseModel<IGameResource> = {
                    message: "game deleted",
                    httpCode: 200
                };
                game.game_status = EGameStatus.DELETED;
                await this.serviceFactory.getGameRepository().update(game.id, game);
                await this.battleWorkerService.deleteGame(game.id)
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
            }
            else {
                const response: HttpResponseModel<IGameResource> = {
                    message: "game not found",
                    httpCode: 404
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
            }
        }
        catch (e) {
            console.log(e);
            const response: HttpResponseModel<IGameResource> = {
                message: e.message,
                httpCode: 400
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    public async findAll(): Promise<SendResource<HttpResponseModel<Array<IGameResource>>>> {
        const gameResourceAsm = Container.get(GameResourceAsm);
        try {
            const list = await this.serviceFactory.getGameRepository().list();
            const resources = await gameResourceAsm.toResources(list);
            const response : HttpResponseModel<Array<IGameResource>> = {
                httpCode: 200,
                message: "game list",
                data: resources
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<Array<IGameResource>>>("GameController", response.httpCode, response));        
        }
        catch (e){
            const response: HttpResponseModel<Array<IGameResource>> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<Array<IGameResource>>>("GameController", response.httpCode, response));
        }
    }

    public async findOne(id: number){
        try {
            const game = await this.serviceFactory.getGameRepository().getOne(id);
            const gameResourceAsm = Container.get(GameResourceAsm);
            const userResourceAsm = Container.get(UserResourceAsm);
            const sessionResourceAsm = Container.get(SessionResourceAsm);
            const streamResourceAsm = Container.get(StreamsResourceAsm);
            const botResourceAsm = Container.get(BotResourceAsm);

            if (!game){
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: 404,
                    message: "game not found",
                };
        
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
            }
            const resource = await gameResourceAsm.toResource(game);
            if (await this.serviceFactory.getStreamsRepository().hasStream(id)){
                await gameResourceAsm.AddStreamResouce(game, resource);
            }
            if ((await game.arena)! && !(await this.serviceFactory.getBotsRepository().hasBotsByArena((await game.arena).id))){
                game.arena.robotArena = [];
            }
            if (await this.serviceFactory.getArenaRepository().hasArena(id)){
                await gameResourceAsm.AddArenaResource(game, resource);
            }
            let gameUsers = await game.gameUsers;
            let sessions = await game.sessions;
            if (!gameUsers){
                gameUsers = [];
            }
            if (!sessions){
                sessions = [];
            }
            for (let gameUser of gameUsers){
                gameUser.game = game;
                const player: IPlayerResource = await gameResourceAsm.AddGamesUsersInGameResource(gameUser, resource);
                let list: Array<RobotsEntity> = await this.serviceFactory.getBotsRepository().search(gameUser.game.id, gameUser.user.id);
                let sessions = await this.serviceFactory.getSessionRepository().search(gameUser.game.id, gameUser.user.id);

                 if (!sessions){
                    sessions = [];
                }
                if (sessions.length > 0){
                    player.botContext = sessionResourceAsm.toResource(sessions[0]);
                }
                if (!list){
                    list = [];
                }
                const streamResources = [];
                const botResources = [];
                for (let item of list){
                    const streams = await this.serviceFactory.getStreamsRepository().search(item.id, game.id);

                    for (let stream of streams){
                        const url = this.streamService.getVideoLink(stream);

                        stream.s3Url = url;
                    }

                    const botResource = await botResourceAsm.toResource(item);

                    for (let stream of streams){
                        streamResources.push(await streamResourceAsm.toResource(stream));
                    }
                    botResources.push(botResource);
                    botResourceAsm.addStreamResource(botResource, streamResources);
                }
                if (botResources.length){
                    await userResourceAsm.AddBotResource(botResources, player);
                }
            }
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: "game detail",
                data: resource
            };
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));            
        }
        catch (e){
            console.log(e);
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    public async linkBotToGame(botId: number, gameId: number){
        try {
            const game = await this.serviceFactory.getBotGameRepository().linkBotToGame(botId, gameId);
            const gameResourceAsm = Container.get(GameResourceAsm);
            const resource = await gameResourceAsm.toResource(game);
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 200,
                message: `link bot ${botId} to game ${gameId}`,
                data: resource
            };

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
