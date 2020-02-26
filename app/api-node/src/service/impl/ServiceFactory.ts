import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { UserRepository } from "../../database/repositories/UserRepository";
import { PlayerRepository } from "../../database/repositories/PlayerRepository";

@Singleton
export default class ServiceFactory implements IServiceFactory {
    @Inject
    private userRepository : UserRepository;

    @Inject
    private playerRepository: PlayerRepository;

    public getUserRepository() : UserRepository{
        return (this.userRepository);
    }

    public getPlayerRepository() : PlayerRepository{
        return (this.playerRepository);
    }
}