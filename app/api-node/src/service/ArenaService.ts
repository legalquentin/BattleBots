import { IArenaResource } from "../resources/IArenaResource";

export abstract class ArenaService {
    public abstract saveOrUpdate(arena: IArenaResource);
    public abstract findOne(id: number);
    public abstract findAll();
    public abstract deleteOne(id: number);
    public abstract linkBot(arenaId: number, botId: number);
} 