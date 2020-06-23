import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { UserRepository } from "../../database/repositories/UserRepository";
import { PlayerRepository } from "../../database/repositories/PlayerRepository";
import { GameRepository } from "../../database/repositories/GameRepository";
import { ArenaRepository } from "../../database/repositories/ArenaRepository";
import { BotsRepository } from "../../database/repositories/BotsRepository";
import { StreamsRepository } from "../../database/repositories/StreamsRepository";
import { LogRepository } from "../../database/repositories/LogRepository";
import { BotArenaRepository } from "../../database/repositories/BotArenaRepository";
import { BotGameRepository } from "../../database/repositories/BotGameRepository";
import { UserGameRepository } from "../../database/repositories/UserGameRepository";
import { RobotsUserRepository } from "../../database/repositories/RobotsUserRepository";
import { SessionRepository } from "../../database/repositories/SessionRepository";
import { ConnectedUserRepository } from "../../database/repositories/ConnectedUserRepository";
import { GeoIpRepository } from "../../database/repositories/GeoIpRepository";
import { GeoIpUserRepository } from "../../database/repositories/GeoIpUserRepository";
import { ConnectedUserGeoipRepository } from "../../database/repositories/ConnectedUserGeoipRepository";

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

    @Inject
    private botsRepository: BotsRepository;

    @Inject
    private streamsRepository: StreamsRepository;

    @Inject
    private logRepository: LogRepository;

    @Inject
    private botsArenaRepository: BotArenaRepository;

    @Inject
    private botGameRepository: BotGameRepository;

    @Inject
    private botUserRepository: RobotsUserRepository;

    @Inject
    private userGameRepository: UserGameRepository;

    @Inject
    private sessionRepository: SessionRepository;

    @Inject
    private userConnectedRepository: ConnectedUserRepository;

    @Inject
    private geoIpRepository: GeoIpRepository;

    @Inject
    private geoIpUserRepository: GeoIpUserRepository;

    @Inject
    private connectedUserGeoIpRepository: ConnectedUserGeoipRepository;


    public getGeoIpRepository(): GeoIpRepository {
        return (this.geoIpRepository);
    }

    public getGeopIpUserRepository(): GeoIpUserRepository {
        return (this.geoIpUserRepository);
    }

    public getUserConnectedGeoIpRepository(): ConnectedUserGeoipRepository {
        return (this.connectedUserGeoIpRepository);
    }

    public getUserConnectedRepository(): ConnectedUserRepository {
        return (this.userConnectedRepository);
    }

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

    public getBotsRepository(): BotsRepository {
        return (this.botsRepository);
    }

    public getStreamsRepository(): StreamsRepository {
        return (this.streamsRepository);
    }

    public getLogRepository(): LogRepository {
        return (this.logRepository);
    }

    public getBotsArenaRepository(): BotArenaRepository {
        return (this.botsArenaRepository);
    }

    public getBotGameRepository(): BotGameRepository {
        return (this.botGameRepository);
    }   

    public getUserGameRepository(): UserGameRepository {
        return (this.userGameRepository);
    }

    public getBotUserRepository(): RobotsUserRepository {
        return (this.botUserRepository);
    }

    public getSessionRepository(): SessionRepository {
        return (this.sessionRepository);
    }

}
