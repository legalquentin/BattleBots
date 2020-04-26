import { PlayerEntity } from "../database/entities/PlayerEntity";
import IGameProfileResource from "../resources/IGameProfileResource";

export abstract class PlayerService {
    public abstract deleteOne(id: number);
    public abstract findOne(id: number);
    public abstract search(options: any);
    public abstract findAll();

    public abstract playerExist(id: number);
    public abstract register(player: IGameProfileResource, id: number);
}