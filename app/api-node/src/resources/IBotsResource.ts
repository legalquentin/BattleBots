import { IStreamResource } from "./IStreamResource";
import { IGameResource } from "./IGameResource";

export interface IBotsResource {
    id: number;
    address: string;
    running: number;
    taken: number;
    name: string;
    baseSpeed: number;
    baseDamage: number;
    baseFireRate: number;
    baseHull: number;
    streams? : Array<IStreamResource>;
    games?: Array<IGameResource>;
}
