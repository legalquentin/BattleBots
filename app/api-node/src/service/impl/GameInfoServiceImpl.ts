import { GameInfoService } from "../GameInfoService";
import { GameInfoEntity } from "../../database/entities/GameInfoEntity";
import { IGameInfoResource } from "../../resources/IGameInfoResource";
import { GameInfoRepository } from "../../database/repositories/GameInfoRepository";
import { GameInfoResourceAsm } from "../../resources/asm/GameInfoResourceAsm";
import { Inject } from "typescript-ioc";
import HttpResponseModel from "../../resources/HttpResponseModel";

export class GameInfoServiceImpl implements GameInfoService  {

    @Inject
    gameInfoRepository: GameInfoRepository;

    @Inject
    gameInfoResourceAsm: GameInfoResourceAsm;

    public async save(gameInfo: IGameInfoResource): Promise<HttpResponseModel<IGameInfoResource>> {
        try {
            const entity = await this.gameInfoResourceAsm.toEntity(gameInfo);
            const saved = await this.gameInfoRepository.save(entity);
            const resource = await this.gameInfoResourceAsm.toResource(saved);
            const response: HttpResponseModel<IGameInfoResource> = {
                httpCode: 200,
                data: resource
            };

            return (response);
        }
        catch (e){
            const response: HttpResponseModel<IGameInfoResource> = {
                httpCode: 400
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
                httpCode: 400
            };

            return (response);
        }
    }

    public async list(): Promise<HttpResponseModel<IGameInfoResource[]>> {
        try {
            const infos = await this.gameInfoRepository.find();
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
            const info = await this.gameInfoRepository.findOne(id);
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
