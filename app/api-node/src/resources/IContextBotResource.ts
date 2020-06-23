import { IBotsResource } from "./IBotsResource";
import { IGameResource } from "./IGameResource";
import IUserResource from "./IUserResource";
import { IStreamResource } from "./IStreamResource";
import { ConnectedUserResource } from "./ConnectedUserResource";

export class IContextBotResource {
    energy: number;
    heat: number;
    bot?: IBotsResource;
    game?: IGameResource;
    user?: IUserResource;
    stream?: IStreamResource;
    connected?: ConnectedUserResource;
}