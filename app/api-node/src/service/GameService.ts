import { IGameResource } from "../resources/IGameResource";

export abstract class GameService {
    public abstract findOne(id: number);

    public abstract findAll();
    public abstract saveOrUpdate(game: IGameResource);
    public abstract deleteOne(id: number);

    public abstract linkBotToGame(botId: number, gameId: number);
    public abstract linkStreamToGame(streamId: number, gameId: number);
    public abstract linkArenaToGame(arenaId: number, gameId: number);
}
