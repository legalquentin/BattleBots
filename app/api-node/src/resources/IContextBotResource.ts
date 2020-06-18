import { IBotsResource } from "./IBotsResource";
import { IGameResource } from "./IGameResource";
import IUserResource from "./IUserResource";
import { IStreamResource } from "./IStreamResource";

export class IContextBotResource {
    botEnergy: number;
    botHeat: number;
    bot?: IBotsResource;
    game?: IGameResource;
    user?: IUserResource;
    stream?: IStreamResource;
}