import { RobotsEntity } from "../database/entities/RobotsEntity";
import { IBotsResource } from "../resources/IBotsResource";
import { SendResource } from "../../lib/ReturnExtended";
import HttpResponseModel from "../resources/HttpResponseModel"; 

export abstract class BotsService {
    public abstract __saveOrUpdate(bots: RobotsEntity): Promise<RobotsEntity>;
    public abstract saveOrUpdate(bots: IBotsResource): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract __findOne(id: number): Promise<RobotsEntity>;
    public abstract findOne(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract __findByUser(userId: number): Promise<Array<RobotsEntity>>;
    public abstract findByUser(userId: number): Promise<SendResource<HttpResponseModel<Array<IBotsResource>>>>;

   // public abstract findAll(): Promise<SendResource<HttpResponseModel<Array<RobotsEntity>>>>;
    public abstract findAll(): Promise<Array<RobotsEntity>>;

    public abstract deleteOne(id: number) : Promise<Boolean>;
  //  public abstract deleteOne(id: number) : Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract enable(id: number): Promise<RobotsEntity>;
   // public abstract enable(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract disable(id: number): Promise<RobotsEntity>;
    //public abstract disable(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract take(id: number): Promise<RobotsEntity>;
  //  public abstract take(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract release(id: number): Promise<RobotsEntity>;
  //  public abstract release(id: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract __linkBotToPlayer(botId: number, playerId: number): Promise<RobotsEntity>;
    public abstract linkBotToPlayer(botId: number, playerId: number): Promise<SendResource<HttpResponseModel<IBotsResource>>>;

    public abstract __linkBotToStream(botId: number, streamId: number);
    public abstract linkBotToStream(botId: number, streamId: number);
}