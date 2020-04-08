import { IGameResource } from "./IGameResource";
import { IBotsResource } from "./IBotsResource";

export class IStreamResource {
    game?: IGameResource;
    robot?: IBotsResource;
    kinesisUrl: string;
    s3Url: string;
    private: number;
    running: number;
    duration: number;
    encodage: string;
    id?: number;
}
