import { ArenaEntity } from "../database/entities/ArenaEntity";

export abstract class ArenaService {
    public abstract saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>;
    public abstract findOne(id: number): Promise<ArenaEntity>;
    public abstract findAll(): Promise<Array<ArenaEntity>>;
    public abstract deleteOne(id: number) : Promise<Boolean>;
} 