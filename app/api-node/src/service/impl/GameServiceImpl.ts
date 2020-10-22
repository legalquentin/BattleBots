import { GameService } from "../GameService";
import { Inject, Singleton } from "typescript-ioc";
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
import UserEntity from "../../database/entities/UserEntity";
import { ConnectedUserEntity } from "../../database/entities/ConnectedUserEntity";
import { Not } from "typeorm";

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

    @Inject
    private gameResourceAsm: GameResourceAsm;

    @Inject
    private playerResourceAsm: PlayerResourceAsm;

    @Inject
    private botResourceAsm: BotResourceAsm;

    @Inject
    private userResourceAsm: UserResourceAsm;

    @Inject
    private sessionResourceAsm: SessionResourceAsm;

    @Inject
    private streamResourceAsm: StreamsResourceAsm;

    private async mapPlayerResources(playerResources: Array<IPlayerResource>){
        const userGames = [];
        const bots = [];
        const sessions = [];
        const streams = []
        const params = [];
        const botUsers = [];

        for (let playerResource of playerResources){
            const botGame = new RobotGameEntity();
            const userGame = new GameUserEntity();
            const session = new SessionEntity();
            let streamEntity = new StreamsEntity();
            const botUser = new RobotsUserEntity();   
            console.log(playerResource); 
            const robotEntity : RobotsEntity = await this.botResourceAsm.toEntity(playerResource.botSpecs);
            const playerEntity : UserEntity = await this.playerResourceAsm.toEntity(playerResource);
            const connected: ConnectedUserEntity = await this.serviceFactory.getUserConnectedRepository().getLatested(playerEntity.id);
            const resolve_path = `${playerResource.stream}`;
            const o = path.parse(resolve_path);
            let param :any= {};

            await this.serviceFactory.getBotsRepository().save(robotEntity);
            botUser.user = playerEntity;
            botUser.robot = robotEntity;
            botGame.bot = robotEntity;
            userGame.user = playerEntity
            streamEntity.s3Url = playerResource.stream;
            streamEntity.kinesisUrl = "kinesis.com";
            streamEntity.encodage = "ffmpeg";
            streamEntity.duration = 1;
            streamEntity.running = 1;
            streamEntity.private = 1;
            streamEntity.robot = robotEntity;
            session.player = playerEntity;
            session.bot = robotEntity;
            session.stream = streamEntity;
            session.connected = connected;
            if (playerResource.botContext){
                session.botEnergy = playerResource.botContext.energy;
                session.botHeat = playerResource.botContext.heat;
                session.botHealth = playerResource.botContext.health;
            }
            param.Key = `${uuid()}.${o.ext}`,
            param.Bucket = this.config.getBucket(),
            param.Body = fs.createReadStream(resolve_path);
            param.Body.on('error', (err) => {
                // do something with `err`
                console.log(err);
                param = null;
                streamEntity = null;
                session.stream = null;
            });
            bots.push(botGame);
            userGames.push(userGame);
            botUsers.push(botUser);
            params.push(param);
            streams.push(streamEntity);
            sessions.push(session);
        }
        return {
            userGames, bots, streams, sessions, params, botUsers
        };
    }

    public async saveOrUpdate(game: IGameResource) {
        game.status = game.status ? game.status : EGameStatus.CREATED;
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
            const entity = await this.gameResourceAsm.toEntity(game);
            let playersResource = game.players;
            if (!playersResource){
                playersResource = [];
            }
            const idList = playersResource.map(p => p.id);
            await this.serviceFactory.getBotUserRepository().deleteUsers(idList);
            const { sessions, streams, params, bots, userGames, botUsers } = await this.mapPlayerResources(playersResource);
            let saved = null;
            await this.serviceFactory.getGameRepository().manager.transaction(async (manager) => {
                saved = await this.serviceFactory.getGameRepository().saveOrUpdate(manager, entity);
                
                let i = 0;
                for (let stream of streams)
                {
                    if (stream != null)
                        (stream as StreamsEntity).game = saved;
                    else
                        streams.splice(i, 1)
                    i++;
                }
                for (let bot of bots)
                {
                    (bot as RobotGameEntity).game = saved;
                }
                for (let userGame of userGames)
                {
                    (userGame as GameUserEntity).game = saved;
                }
                for (let session of sessions)
                {
                    (session as SessionEntity).game = saved;
                }
                await this.serviceFactory.getBotUserRepository().saveAll(manager, botUsers);
                await this.serviceFactory.getGameRepository().AddBotGame(manager, bots);
                await this.serviceFactory.getGameRepository().AddStreamInGame(manager, streams);
                await this.serviceFactory.getGameRepository().AddUserGame(manager, userGames);
                await this.serviceFactory.getGameRepository().AddSessionInGame(manager, sessions);
            });
            game.id = saved.id;
            const resource = await this.gameResourceAsm.toResource(saved);
            if (game.status == EGameStatus.ENDED){
                this.streamService.uploadAll(streams, params).catch(e => {
                    console.log(e);
                });
            }
            if (game.status == EGameStatus.CREATED){
                const r = await this.battleWorkerService.startGoWorker(game);
                if (!r || !r.token || !r.secret) {
                    const response: HttpResponseModel<IGameResource> = {
                        httpCode: 500,
                        message: JSON.stringify(r)
                    };
                    console.log("ERROR, DELETING THE GAME")
                    await this.serviceFactory.getGameRepository().deleteGame(saved);
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
            console.log(e);
            const response: HttpResponseModel<IGameResource> = {
                httpCode: 400,
                message: "Bad Request"
            };
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }

    public joinGame(gameId: number, userId: number, botId: number) {
        return Promise.resolve(this.battleWorkerService.joinGame(gameId, userId, botId));
    }

    public async linkArenaToGame(arenaId: number, gameId: number) {
        try {
            const game = await this.serviceFactory.getGameRepository().linkArenaToGame(arenaId, gameId);
            const response = {
                httpCode: 200,
                data: await this.gameResourceAsm.toGameResource(game),
                message: `link arena ${arenaId} to game ${gameId}`
            };

            await this.gameResourceAsm.AddArenaResource(game, response.data);
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
            const game  = await this.serviceFactory.getGameRepository().linkStreamToGame(streamId, gameId);
            const response = {
                message: `link stream ${streamId} to game ${gameId}`,
                httpCode: 200,
                data: await this.gameResourceAsm.toResource(game)
            };

            await this.gameResourceAsm.AddStreamResouce(game, response.data);
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
            const userGame  = await this.serviceFactory.getUserGameRepository().linkUserToGame(gameId, userId);
            const response = {
                message: `link user ${userId} to game ${gameId}`,
                httpCode: 200,
                data: await this.gameResourceAsm.toResource(userGame.game)
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
        try {
            const list = await this.serviceFactory.getGameRepository().find({
                game_status: Not(EGameStatus.DELETED)
            });
            const resources = await this.gameResourceAsm.toResources(list);
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

            if (!game){
                const response : HttpResponseModel<IGameResource> = {
                    httpCode: 404,
                    message: "game not found",
                };
        
                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
            }
            const resource = await this.gameResourceAsm.toResource(game);
            if (await this.serviceFactory.getStreamsRepository().hasStream(id)){
                await this.gameResourceAsm.AddStreamResouce(game, resource);
            }
            if ((await game.arena)! && !(await this.serviceFactory.getBotsRepository().hasBotsByArena((await game.arena).id))){
                game.arena.robotArena = [];
            }
            if (await this.serviceFactory.getArenaRepository().hasArena(id)){
                await this.gameResourceAsm.AddArenaResource(game, resource);
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
                const player: IPlayerResource = await this.gameResourceAsm.AddGamesUsersInGameResource(gameUser, resource);
                let list: Array<RobotsEntity> = await this.serviceFactory.getBotsRepository().search(gameUser.game.id, gameUser.user.id);
                let sessions = await this.serviceFactory.getSessionRepository().search(gameUser.game.id, gameUser.user.id);

                 if (!sessions){
                    sessions = [];
                }
                if (sessions.length > 0){
                    player.botContext = this.sessionResourceAsm.toResource(sessions[0]);
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
                    const botResource = await this.botResourceAsm.toResource(item);
                    for (let stream of streams){
                        streamResources.push(await this.streamResourceAsm.toResource(stream));
                    }
                    botResources.push(botResource);
                    this.botResourceAsm.addStreamResource(botResource, streamResources);
                }
                if (botResources.length){
                    await this.userResourceAsm.AddBotResource(botResources, player);
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
            const resource = await this.gameResourceAsm.toResource(game);
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
