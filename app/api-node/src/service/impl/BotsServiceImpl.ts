import { BotsService } from "../BotsService";
import { RobotsEntity } from "../../database/entities/RobotsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton, Container } from "typescript-ioc";
import { IBotsResource } from "../../resources/IBotsResource";
import { SendResource } from "../../../lib/ReturnExtended";
import HttpResponseModel from "../../resources/HttpResponseModel";
import { BotResourceAsm } from "../../resources/asm/BotResourceAsm";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";

@Singleton
export class BotsServiceImpl implements BotsService {

    @Inject
    private service: IServiceFactory;


    public async __saveOrUpdate(bots: RobotsEntity): Promise<RobotsEntity>
    {
        try {
            if (bots.id){
                await this.service.getBotsRepository().update(bots.id, bots);
            }
            else {
                await this.service.getBotsRepository().save(bots);
            }
            return bots;
        }
        catch (e)
        {
            throw e;
        }
    }

    public async saveOrUpdate(bots: IBotsResource): Promise<SendResource<HttpResponseModel<IBotsResource>>>
    {
        const botResourceAsm = Container.get(BotResourceAsm);
        const entity = await botResourceAsm.toEntity(bots);

        try {
            const saved = await this.__saveOrUpdate(entity);
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
                message: e.message
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotController", response.httpCode, response));
        }
    }

    public __findOne(id: number): Promise<RobotsEntity>
    {
        return (this.service.getBotsRepository().
        createQueryBuilder("bots").
        leftJoinAndSelect("bots.player", "player").
        where("bots.id = :id", {
            "id": id
        }).getOne());
    }

    public async findOne(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>> {
        try {
            const bot = await this.__findOne(id);
            const botResourceAsm = Container.get(BotResourceAsm);

            console.log(bot);
            if (!bot){
                const response: HttpResponseModel<IBotsResource> = {
                    httpCode: 404,
                    message: "bot not found"
                };

                return (Promise.resolve(new SendResource<HttpResponseModel<IBotsResource>>("BotsController", response.httpCode, response)));
            }
            const resource = await botResourceAsm.toResource(bot);
            console.log(resource);
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

    public async findAll(): Promise<Array<RobotsEntity>>
    {
        return (this.service.getBotsRepository().find());
    }

    public async deleteOne(id: number) : Promise<Boolean>
    {
        try {
            const bots = await this.__findOne(id);

            if (bots)
            {
                await this.service.getBotsRepository().createQueryBuilder("bot").delete().from(RobotsEntity, "bot").where("id = :id", {
                    id: id
                }).execute();
                return (true);
            }
            else
            {
                return (false);
            }
        }
        catch (e)
        {
            throw e;
        }
    }

    public async enable(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.__findOne(id);

            bots.running = 1;
            return this.__saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }

    public async disable(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.__findOne(id);

            bots.running = 0;
            return this.__saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }  

    public async take(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.__findOne(id);

            bots.taken = 1;
            return this.__saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }

    public async release(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.__findOne(id);

            bots.taken = 0;
            return this.__saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }

    public async __linkBotToPlayer(botId: number, playerId: number): Promise<RobotsEntity> {
        try {
            const bot = await this.service.getBotsRepository().findOne(botId);

            if (!bot){
                throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
            }
            const player = await this.service.getPlayerRepository().findOne(playerId);

            if (!player){
                throw new EntityError(EEntityStatus.NOT_FOUND, "player not found");
            }
            bot.player = player;
            await this.service.getBotsRepository().update(bot.id, bot);
            return (bot);
        }
        catch (e){
            throw new EntityError(EEntityStatus.INTERNAL_ERROR, e.message);
        }
    }

    public async __findByUser(userId: number): Promise<RobotsEntity[]> {
        const bots = await this.service.getBotsRepository().createQueryBuilder().select("robots").from(RobotsEntity, "robots").leftJoinAndSelect("robots.player", "player").leftJoinAndSelect("player.user", "user").where("user.id = :id", {
            id: userId
        }).getMany();
   
        return (bots);
    }

    public async findByUser(userId: number) {
        try {
            const bots = await this.__findByUser(userId);
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
            const botResourceAsm = Container.get(BotResourceAsm);
            const response: HttpResponseModel<IBotsResource> = {};
            const entity : RobotsEntity = await this.__linkBotToPlayer(botId, playerId);
            const resource = await botResourceAsm.toResource(entity);

            response.httpCode = 200;
            response.data = resource;
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

    public async __linkBotToStream(botId: number, streamId: number) {
        const bot = await this.service.getBotsRepository().createQueryBuilder("robots").leftJoinAndSelect("robots.streams", "streams").where("robots.id = :id", {
            id: botId
        }).getOne();

        if (!bot){
            throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
        }
        const stream = await this.service.getStreamsRepository().findOne(streamId);

        if (!stream){
            throw new EntityError(EEntityStatus.NOT_FOUND, "stream not found");
        }
        stream.robot = bot;
        const streams = await bot.streams;
        if (streams){
            for (let s of streams){
                if (s.id === stream.id){
                    throw new EntityError(EEntityStatus.INTERNAL_ERROR, "already join");
                }
            }
            streams.push(stream);
            bot.streams = streams;
        }
        bot.streams = [
            stream
        ];
        await this.service.getStreamsRepository().update(stream.id, stream);
        return (bot);
    }


    public async linkBotToStream(botId: number, streamId: number) {
        try {
            const bot = await this.__linkBotToStream(botId, streamId);
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
