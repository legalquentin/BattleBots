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
        const updated = await this.serviceFactory.getGameRepository().saveOrUpdate(entity);
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
        try {
            const httpCode = game.id ? 200 : 201;
            if (game.status == EGameStatus.CREATED){
                game.createdAt = new Date().getTime();
            }
            else if (game.status == EGameStatus.STARTED){
                game.startedAt = new Date().getTime();
            }
            else if (game.status == EGameStatus.ENDED){
                game.endedAt = new Date().getTime();
            }
            const entity = await gameResourceAsm.toEntity(game);
            const players = game.players;
            const promise = () => (new Promise(async (resolve, reject) => {
                if (players){
                    let params = [];
                    for (let player of players){
                        const streamEntity = new StreamsEntity();
                        const resolve_path = `${player.stream}`;
                        const o = path.parse(resolve_path);
                        let i = 0;

                        streamEntity.s3Url = player.stream;
                        streamEntity.kinesisUrl = "kinesis.com";
                        streamEntity.encodage = "ffmpeg";
                        streamEntity.duration = 1;
                        streamEntity.running = 1;
                        streamEntity.private = 1;
                        this.streamService.upload(streamEntity, {
                            Key: `${uuid()}${o.ext}`,
                            Bucket: this.config.getBucket(),
                            Body: fs.createReadStream(resolve_path)
                        }, (param) => {
                            params.push(param);
                            if (players.length == (i)){
                                resolve(params);
                            }
                            i++;
                        });
                    }
                }
            }));
            await promise();
            const saved = await this.serviceFactory.getGameRepository().saveOrUpdate(entity);
            const resource = await gameResourceAsm.toResource(saved);
            game.id = saved.id;
            const r = await this.battleWorkerService.startGoWorker(game);
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

                await this.serviceFactory.getGameRepository().delete(game.id);
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
        catch (e){
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
            const sessions = await game.sessions;
            if (!gameUsers){
                gameUsers = [];
            }
            for (let gameUser of gameUsers){
                const player: IPlayerResource = await gameResourceAsm.AddGamesUsersInGameResource(gameUser, resource);
                let list: Array<RobotsEntity> = await this.serviceFactory.getBotsRepository().search(id, player.id);

                //TOFIX: refacto in more readable code 
                if (sessions && sessions.length){
                    for (let session of sessions){
                        if (session.player.id == gameUser.user.id && session.game.id == gameUser.game.id){
                            player.botContext = sessionResourceAsm.toResource(session);
                        }
                    }
                }
                if (!list){
                    list = [];
                }
                if (list.length){
                    await userResourceAsm.AddBotResource(list[0], player);
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
