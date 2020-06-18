import { IBotsResource } from "./IBotsResource";
import { ERolesStatus } from "./ERolesStatus";
import { IContextBotResource } from "./IContextBotResource";

export interface IPlayerResource {
    id: number;
    pseudo: string; 
    email: string;
    roles: ERolesStatus;
    bot?: IBotsResource;
    context?: IContextBotResource;
    stream?: string;
} 