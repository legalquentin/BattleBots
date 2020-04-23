import { ArenaEntity } from "../database/entities/ArenaEntity";

export abstract class ArenaService {
    public abstract saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>;
    public abstract findOne(id: number): Promise<ArenaEntity>;
    public abstract findAll(): Promise<Array<ArenaEntity>>;
    public abstract deleteOne(id: number) : Promise<Boolean>;
    public abstract disable(id: number): Promise<Boolean>;
    public abstract enable(id: number): Promise<Boolean>;
    public abstract __linkBot(arenaId: number, botId: number): Promise<ArenaEntity>;
    public abstract linkBot(arenaId: number, botId: number);
} 