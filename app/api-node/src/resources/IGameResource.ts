import { EGameStatus } from "./EGameStatus";
import { IArenaResource } from "./IArenaResource";
import { IStreamResource } from "./IStreamResource";
import { IPlayerResource } from "./IPlayerResource";

export class IGameResource {
    id?: number;
    name: string;
    arena?: IArenaResource;
    players?: Array<IPlayerResource>;
    //streams?: Array<IStreamResource>;
    status: EGameStatus;
    createdAt?: number;
    startedAt?: number;
    endedAt?: number;
    token?: string;
    secret?: string;
}
