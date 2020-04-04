import { EGameStatus } from "./EGameStatus";

export class IGameResource {
    id?: number;
    name: string;
    arenaId?: number;
    status: EGameStatus;
    createdAt?: string;
    updatedAt?: string;
}
