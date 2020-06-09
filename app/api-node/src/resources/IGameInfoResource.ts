import IGameProfileResource from "./IGameProfileResource";
import { IGameResource } from "./IGameResource";

export class IGameInfoResource {
    winner?: IGameProfileResource;
    loser?: IGameProfileResource;
    winnerpoints?: number;
    loserpoints?: number;
    gamestarted_at?: Date;
    gameended_at?: Date;
    video_winner?: string;
    video_loser?: string;
    game?: IGameResource;
    created_at?: Date;
    updated_at?: Date;
}