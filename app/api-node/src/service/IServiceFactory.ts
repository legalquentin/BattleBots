import { UserRepository } from "../database/repositories/UserRepository";
import { PlayerRepository } from "../database/repositories/PlayerRepository";
import { GameRepository } from "../database/repositories/GameRepository";
import { ArenaRepository } from "../database/repositories/ArenaRepository";


export default abstract class IServiceFactory {
    public abstract getUserRepository() : UserRepository;
    public abstract getPlayerRepository() : PlayerRepository;
    public abstract getGameRepository(): GameRepository;
    public abstract getArenaRepository(): ArenaRepository;
}