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
    createdAt?: string;
    updatedAt?: string;
    token?: string;
    secret?: string;
}
