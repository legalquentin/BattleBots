import { GameInfoService } from "../GameInfoService";
import { IGameInfoResource } from "../../resources/IGameInfoResource";
import { GameInfoRepository } from "../../database/repositories/GameInfoRepository";
import { GameInfoResourceAsm } from "../../resources/asm/GameInfoResourceAsm";
import { Inject } from "typescript-ioc";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { GameRepository } from "../../database/repositories/GameRepository";
import { StreamsService } from "../StreamsService";

export class GameInfoServiceImpl implements GameInfoService  {

    @Inject
    gameInfoRepository: GameInfoRepository;

    @Inject
    gameRepository: GameRepository;

    @Inject
    gameInfoResourceAsm: GameInfoResourceAsm;

    @Inject
    streamsService: StreamsService;


    public async save(gameInfo: IGameInfoResource): Promise<HttpResponseModel<IGameInfoResource>> {
        try {
            const entity = await this.gameInfoResourceAsm.toEntity(gameInfo);
            if (!entity.game){
                const response: HttpResponseModel<IGameInfoResource> = {
                    httpCode: 400,
                    message: "bad request"
                };            
                return(response);
            }
            entity.game = await this.gameRepository.findOne(entity.game.id);
            entity.game.game_status = gameInfo.game.status;
            // entity.game.
            entity.game.ended_at = new Date();
            if (gameInfo.video_loser) {
                await this.streamsService.watchDirectory({
                    game: gameInfo.game,
                    s3Url: gameInfo.video_loser,
                    kinesisUrl: null,
                    private: 0,
                    running: 0,
                    duration: 1,
                    encodage: "ffmpeg" 
                });
                await this.streamsService.watchDirectory({
                    game: gameInfo.game,
                    s3Url: gameInfo.video_winner,
                    kinesisUrl: null,
                    private: 0,
                    running: 0,
                    duration: 1,
                    encodage: "ffmpeg" 
                });
            }
            console.log("saving", entity)
            await this.gameRepository.update(entity.game.id, entity.game);
            const saved = await this.gameInfoRepository.save(entity);
            const resource = await this.gameInfoResourceAsm.toResource(saved);
            const response: HttpResponseModel<IGameInfoResource> = {
                httpCode: 200,
                data: resource
            };

            return (response);
        }
        catch (e){
            console.log(e.message);
            const response: HttpResponseModel<IGameInfoResource> = {
                httpCode: 400,
                message: "bad request"
            };

            return (response);
        }
    }

    public async update(gameInfo: IGameInfoResource): Promise<HttpResponseModel<IGameInfoResource>> {
        try {
            const entity = await this.gameInfoResourceAsm.toEntity(gameInfo);
            const finded = await this.gameInfoRepository.findOne(entity.id);
            const saved = await this.gameInfoRepository.merge(finded, entity);
            const resource = await this.gameInfoResourceAsm.toResource(saved);
            const response: HttpResponseModel<IGameInfoResource> = {
                httpCode: 200,
                data: resource
            };

            return (response);
        }
        catch (e){
            const response: HttpResponseModel<IGameInfoResource> = {
                httpCode: 400,
                message: "bad request"
            };

            return (response);
        }
    }

    public async list(): Promise<HttpResponseModel<IGameInfoResource[]>> {
        try {
            const infos = await this.gameInfoRepository.findAll();
            const resources = await this.gameInfoResourceAsm.toResources(infos);
            const response : HttpResponseModel<IGameInfoResource[]> = {
                httpCode: 200,
                data: resources
            };

            return (response);
        }
        catch (e){
            const response: HttpResponseModel<IGameInfoResource[]>  = {
                httpCode: 400
            };

            return (response);
        }
    }
    
    public async findOne(id: number): Promise<HttpResponseModel<IGameInfoResource>> {
        try {
            const info = await this.gameInfoRepository.getOne(id);
            const resource = await this.gameInfoResourceAsm.toResource(info);
            const response : HttpResponseModel<IGameInfoResource> = {
                httpCode: 200,
                data: resource
            };

            return (response);
        }
        catch (e){
            const response: HttpResponseModel<IGameInfoResource>  = {
                httpCode: 400
            };

            return (response);
        }
    }

    public async delete(id: number) {
        try {
            await this.gameInfoRepository.delete(id);
            const response: HttpResponseModel<IGameInfoResource> = {
                httpCode: 200
            };

            return (response);
        }
        catch (e){
            const response: HttpResponseModel<IGameInfoResource[]>  = {
                httpCode: 400
            };

            return (response);
        }
    }
}
