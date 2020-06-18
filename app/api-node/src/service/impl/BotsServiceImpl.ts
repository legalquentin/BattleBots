import { BotsService } from "../BotsService";
//import { RobotsEntity } from "../../database/entities/RobotsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton, Container } from "typescript-ioc";
import { IBotsResource } from "../../resources/IBotsResource";
import { SendResource } from "../../../lib/ReturnExtended";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { BotResourceAsm } from "../../resources/asm/BotResourceAsm";
import { EEntityStatus } from "../../../lib/EEntityStatus";
//import { RobotsUserEntity } from "../../database/entities/RobotsUserEntity";

@Singleton
export class BotsServiceImpl implements BotsService {
    @Inject
    private service: IServiceFactory;

    public async update(bot: IBotsResource) {
        const botResourceAsm = Container.get(BotResourceAsm);

        try {
            const entity = await botResourceAsm.toEntity(bot);
            const updated = await this.service.getBotsRepository().saveOrUpdate(entity);
            const resource = await botResourceAsm.toResource(updated);
            const response : HttpResponseModel<IBotsResource> = {
                httpCode: 200,
                data: resource,
                message: "bot updated"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 400,
                message: "error"
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotsController", response.httpCode, response)));
        }
    }

    public async deleteOne(id: number) {
        try {
            const bot = await this.service.getBotsRepository().findOne(id);

            if (bot == null){
                const response: HttpResponseModel<IBotsResource> = {
                    httpCode: 404,
                    message: "bot not found"
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
            }
            await this.service.getBotsRepository().delete(bot.id);
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 200,
                message: "bot deleted"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
        catch(e){
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 400,
                message: "internal error"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
    }

    public async saveOrUpdate(bots: IBotsResource): Promise<SendResource<HttpResponseModel<IBotsResource>>>
    {
        const botResourceAsm = Container.get(BotResourceAsm);
        try {
            const entity = await botResourceAsm.toEntity(bots);
            const saved = await this.service.getBotsRepository().saveOrUpdate(entity);
            const resource = await botResourceAsm.toResource(saved);
            const response = {
                httpCode: 201,
                message: "bot inserted",
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
        catch (e){
            const response = {
                httpCode: 400,
                message: "Bad Request"
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
    }

    public async findOne(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>> {
        try {
            const bot = await this.service.getBotsRepository().getOne(id);
            const botResourceAsm = Container.get(BotResourceAsm);

            if (!bot){
                const response: HttpResponseModel<IBotsResource> = {
                    httpCode: 404,
                    message: "bot not found"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotsController", response.httpCode, response)));
            }
            const resource = await botResourceAsm.toResource(bot);
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 200,
                data: resource,
                message: "bot details"
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotsController", response.httpCode, response)));
        }
        catch (e){
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 400,
                message: e.message
            };

            return (Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotsController", response.httpCode, response)));
        }
    }

    public async findAll()
    {
        const botResourceAsm = Container.get(BotResourceAsm);
        const robots = await this.service.getBotsRepository().find();
        const resources = await botResourceAsm.toResources(robots);
        const response= {
            httpCode: 200,
            message: "bot list",
            data: resources
        };

        return Promise.resolve(new SendResource<HttpResponseModel<Array<IBotsResource>>>("BotController", response.httpCode, response));
    }

    public async findByUser(userId: number) {
        try {
            const bots = await this.service.getBotsRepository().findByUser(userId);
            const response: HttpResponseModel<Array<IBotsResource>> = {};
            const botResourceAsm = Container.get(BotResourceAsm);

            response.data = await botResourceAsm.toResources(bots);
            response.httpCode = 200;
            response.message = "list of bots by player";
            return Promise.resolve(new SendResource<HttpResponseModel<Array<IBotsResource>>>("BotsController", response.httpCode, response));
        }
        catch (e){
            const response : HttpResponseModel<Array<IBotsResource>> = {};

            response.httpCode = 400;
            response.message = e.message;
            return (Promise.resolve(new SendResource<HttpResponseModel<Array<IBotsResource>>>("BotsController", response.httpCode, response)));
        }
    }

    public async linkBotToPlayer(botId: number, playerId: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>{
        try {
           // const botResourceAsm = Container.get(BotResourceAsm);
            const response: HttpResponseModel<IBotsResource> = {};
            //const entity : RobotsUserEntity = await this.service.getBotUserRepository().linkBotToPlayer(botId, playerId);
            //const resource = await botResourceAsm.toResource(entity);
            await this.service.getBotUserRepository().linkBotToPlayer(botId, playerId);
            response.httpCode = 200;
            //response.data = resource;
            response.message = `link bot ${botId} to player ${playerId}`;
            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
        catch (e){
            const response : HttpResponseModel<IBotsResource> = {};

            if (e.code == EEntityStatus.NOT_FOUND){
                response.httpCode = 404;
                response.message = e.message;
            }
            else if (e.code == EEntityStatus.INTERNAL_ERROR){
                response.httpCode = 400;
                response.message = e.message;
            }
            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response)); 
        }
    }

    public async linkBotToStream(botId: number, streamId: number) {
        try {
            const bot = await this.service.getBotsRepository().linkBotToStream(botId, streamId);
            const botResourceAsm = Container.get(BotResourceAsm);
            const resource = await botResourceAsm.toResource(bot);
            const response = {
                httpCode: 200,
                message: `link bot ${botId} to stream ${streamId}`,
                data: resource
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
        catch (e){
            const response: HttpResponseModel<IBotsResource> = {
                httpCode: 400,
                message: e.message
            }

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
    }
}
