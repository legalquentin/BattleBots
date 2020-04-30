import { IBotsResource } from "./IBotsResource";

export interface IArenaResource {
    id?: number;
    arena_name?: string;
    available?: number;
    bots?: Array<IBotsResource>
}