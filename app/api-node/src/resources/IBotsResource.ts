import { IStreamResource } from "./IStreamResource";
import { IGameResource } from "./IGameResource";

export interface IBotsResource {
    id: number;
    address: string;
    running: number;
    taken: number;
    name: string;
    speed: number;
    damage: number;
    fireRate: number;
    armor: number;
    streams? : Array<IStreamResource>;
    games?: Array<IGameResource>;
}
