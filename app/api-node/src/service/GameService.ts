import { GameEntity } from "../database/entities/GameEntity";

export abstract class GameService {
    public abstract __findOne(id: number): Promise<GameEntity>;
    public abstract findOne(id: number);

    public abstract findAll(): Promise<Array<GameEntity>>;
    public abstract saveOrUpdate(game: GameEntity): Promise<GameEntity>;
    public abstract deleteOne(id: number): Promise<Boolean>;
    public abstract create(game: GameEntity): Promise<GameEntity>;
    public abstract start(id: number): Promise<GameEntity>;
    public abstract stop(id: number): Promise<GameEntity>;
    public abstract end(id: number): Promise<GameEntity>;

    public abstract __linkBotToGame(botId: number, gameId: number);
    public abstract linkBotToGame(botId: number, gameId: number);

    public abstract __linkStreamToGame(streamId: number, gameId: number);
    public abstract linkStreamToGame(streamId: number, gameId: number);

    public abstract __linkArenaToGame(arenaId: number, gameId: number);
    public abstract linkArenaToGame(arenaId: number, gameId: number);
}