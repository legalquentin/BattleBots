import { PlayerService } from "../PlayerService";
/*
import { PlayerEntity } from "../../database/entities/PlayerEntity";
*/
import { /*Inject, */ Singleton } from "typescript-ioc";
//import IServiceFactory from "../IServiceFactory";
/*
import HttpResponseModel from "../../resources/HttpResponseModel";
import IGameProfileResource from "../../resources/IGameProfileResource";
import { SendResource } from "../../../lib/ReturnExtended";
import { GameProfileResourceAsm } from "../../resources/asm/GameProfileResourceAsm";
import IResourceId from "../../resources/IResourceId";
*/

@Singleton
export class PlayerServiceImpl implements PlayerService {

    /*
    @Inject
    private factory : IServiceFactory;
    */
    /*

    public async register(player: IGameProfileResource, id: number) {
        try {
            const entity = new PlayerEntity();

            entity.user = await this.factory.getUserRepository().findOne(id);
            if (!player.total_points){
                player.total_points = 0;
            }
            entity.total_points = player.total_points;
            entity.name = player.name;
            const finded = await this.factory.getPlayerRepository().findOne({
                where: [
                    {
                        name: entity.name
                    }
                ]
            });
            if (finded){
                const response: HttpResponseModel<IResourceId> = {
                    data: null,
                    message: "Player already exist",
                    httpCode: 409
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
            }
            const saved : PlayerEntity = await this.factory.getPlayerRepository().saveOrUpdate(entity);
            const response: HttpResponseModel<IResourceId> = {
                data: {
                    id: saved.id
                },
                message: "Player created",
                httpCode: 201
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IResourceId> = {
                data: null,
                message: "Bad request",
                httpCode: 400
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IResourceId>>("UserController", response.httpCode, response));
        }
    }

    public async deleteOne(id: number) {
        try {
            const player = await this.factory.getPlayerRepository().findOne(id);

            if (player !== null){
                await this.factory.getPlayerRepository().delete(player.id);
                const response: HttpResponseModel<IGameProfileResource[]> = {
                    httpCode: 200,
                    message: "Player deleted"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
            }
            else{
                const response: HttpResponseModel<IGameProfileResource[]> = {
                    httpCode: 404,
                    message: "Player not found"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
            }
        }
        catch (e){
            const response: HttpResponseModel<IGameProfileResource[]> = {
                httpCode: 400,
                message: "Bad request",
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
        }
    }

    public findOne(id: number) : Promise<PlayerEntity> {
        return (this.factory.getPlayerRepository().findOne(id));
    }

    public findAll(): Promise<Array<PlayerEntity>>{
        return (this.factory.getPlayerRepository().find());
    }

    public async search(userId: number) {
        const gameProfileResourceAsm = Container.get(GameProfileResourceAsm);
        try {
            const user = await this.factory.getUserRepository().findOne(userId);
            const players = await this.factory.getPlayerRepository().find({
                where: [
                    {
                        user: user
                    }
                ]
            });
            const resources : IGameProfileResource[] = await gameProfileResourceAsm.toResources(players);
            const response: HttpResponseModel<IGameProfileResource[]> = {
                httpCode: 200,
                message: "User list",
                data: resources
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
        } catch (e){
            const response: HttpResponseModel<IGameProfileResource[]> = {
                httpCode: 400,
                message: "Bad request",
                data: null
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IGameProfileResource[]>>("UserController", response.httpCode, response)));
        }
    }

    public async playerExist(id: number){
        return (await this.factory.getPlayerRepository().findOne(id) != null);
    }
    */
}
