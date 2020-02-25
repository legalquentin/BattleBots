import { UserRepository } from "../database/repositories/UserRepository";
import { PlayerRepository } from "../database/repositories/PlayerRepository";


export default abstract class IServiceFactory {
    public abstract getUserRepository() : UserRepository;
    public abstract getPlayerRepository() : PlayerRepository;
}