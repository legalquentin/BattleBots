import { PlayerEntity } from "../database/entities/PlayerEntity";

export abstract class PlayerService {
    public abstract saveOrUpdate(player: PlayerEntity) : Promise<PlayerEntity>;
    public abstract deleteOne(id: number) : Promise<Boolean>;
    public abstract findOne(id: number) : Promise<PlayerEntity>;
    public abstract search(options: any): Promise<PlayerEntity[]>;
    public abstract findAll(): Promise<Array<PlayerEntity>>;
}