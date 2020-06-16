import { EGameStatus } from "./EGameStatus";
import { IBotsResource } from "./IBotsResource";
import { IArenaResource } from "./IArenaResource";
import { IStreamResource } from "./IStreamResource";

export class IGameResource {
    id?: number;
    name: string;
    arena?: IArenaResource;
    bots?: Array<IBotsResource>;
    streams?: Array<IStreamResource>;
    status: EGameStatus;
    createdAt?: number;
    startedAt?: number;
    endedAt?: number;
    token?: string;
    secret?: string;
}
