import { IGameInfoResource } from "../resources/IGameInfoResource";
import HttpResponseModel from "../resources/HttpResponseModel";
import { IGameResource } from "../resources/IGameResource";

export abstract class GameInfoService {
    public abstract save(gameInfo: IGameResource): Promise<HttpResponseModel<IGameInfoResource>>;
    public abstract update(gameInfo: IGameInfoResource): Promise<HttpResponseModel<IGameInfoResource>>;
    public abstract list(): Promise<HttpResponseModel<Array<IGameInfoResource>>>;
    public abstract findOne(id: number): Promise<HttpResponseModel<IGameInfoResource>>;
    public abstract delete(id: number);
}