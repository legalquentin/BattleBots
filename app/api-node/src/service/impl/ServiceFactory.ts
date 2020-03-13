import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { UserRepository } from "../../database/repositories/UserRepository";
import { PlayerRepository } from "../../database/repositories/PlayerRepository";
import { GameRepository } from "../../database/repositories/GameRepository";
import { ArenaRepository } from "../../database/repositories/ArenaRepository";

@Singleton
export default class ServiceFactory implements IServiceFactory {
    @Inject
    private userRepository : UserRepository;

    @Inject
    private playerRepository: PlayerRepository;

    @Inject
    private gameRepository: GameRepository;

    @Inject
    private arenaRepository: ArenaRepository;

    public getUserRepository() : UserRepository {
        return (this.userRepository);
    }

    public getPlayerRepository() : PlayerRepository{
        return (this.playerRepository);
    }

    public getGameRepository(): GameRepository {
        return (this.gameRepository);
    }

    public getArenaRepository(): ArenaRepository {
        return (this.arenaRepository);
    }
}