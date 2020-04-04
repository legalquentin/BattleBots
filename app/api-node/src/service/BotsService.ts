import { RobotsEntity } from "../database/entities/RobotsEntity";

export abstract class BotsService {
    public abstract saveOrUpdate(bots: RobotsEntity): Promise<RobotsEntity>;
    public abstract findOne(id: number): Promise<RobotsEntity>;
    public abstract findAll(): Promise<Array<RobotsEntity>>;
    public abstract deleteOne(id: number) : Promise<Boolean>;
    public abstract enable(id: number): Promise<RobotsEntity>;
    public abstract disable(id: number): Promise<RobotsEntity>;
    public abstract take(id: number): Promise<RobotsEntity>;
    public abstract release(id: number): Promise<RobotsEntity>;
}