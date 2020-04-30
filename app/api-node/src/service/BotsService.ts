import { IBotsResource } from "../resources/IBotsResource";
import { SendResource } from "../../lib/ReturnExtended";
import HttpResponseModel from "../resources/HttpResponseModel"; 

export abstract class BotsService {
    public abstract saveOrUpdate(bots: IBotsResource): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract findOne(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract findByUser(userId: number): Promise<SendResource<HttpResponseModel<Array<IBotsResource>>>>;

    public abstract findAll();

    public abstract deleteOne(id: number);

    public abstract linkBotToPlayer(botId: number, playerId: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract linkBotToStream(botId: number, streamId: number);

    public abstract update(resource: IBotsResource);
}