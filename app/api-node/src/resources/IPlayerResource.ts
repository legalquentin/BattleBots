import { IBotsResource } from "./IBotsResource";
import { ERolesStatus } from "./ERolesStatus";

export interface IPlayerResource {
    id: number;
    pseudo: string; 
    email: string;
    roles: ERolesStatus;
    bots?: Array<IBotsResource>;
} 