import { IGameResource } from "./IGameResource";
import { IContextBotResource } from "./IContextBotResource";

export abstract class ISessionResource {
    game?: IGameResource;
    list?: Array<IContextBotResource>;
}
