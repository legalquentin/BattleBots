import { IContextBotResource } from "../resources/IContextBotResource";
import HttpResponseModel from "../resources/HttpResponseModel";

export abstract class SessionService {
    public abstract save(log: IContextBotResource): Promise<HttpResponseModel<IContextBotResource>>;
    public abstract update(log: IContextBotResource): Promise<HttpResponseModel<IContextBotResource>>;
    public abstract list(): Promise<HttpResponseModel<Array<IContextBotResource>>>;
    public abstract findOne(id: number): Promise<HttpResponseModel<IContextBotResource>>;
    public abstract delete(id: number);
    public abstract findByGameId(id: number);
}