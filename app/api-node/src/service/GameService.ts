import { GameEntity } from "../database/entities/GameEntity";

export abstract class GameService {
    public abstract findOne(id: number): Promise<GameEntity>;
    public abstract findAll(): Promise<Array<GameEntity>>;
    public abstract saveOrUpdate(game: GameEntity): Promise<GameEntity>;
    public abstract deleteOne(id: number): Promise<Boolean>;
    public abstract create(game: GameEntity): Promise<GameEntity>;
    public abstract start(id: number): Promise<GameEntity>;
    public abstract stop(id: number): Promise<GameEntity>;
    public abstract end(id: number): Promise<GameEntity>;
}