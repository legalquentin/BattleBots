import { UserRepository } from "../database/repositories/UserRepository";
import { PlayerRepository } from "../database/repositories/PlayerRepository";
import { GameRepository } from "../database/repositories/GameRepository";
import { ArenaRepository } from "../database/repositories/ArenaRepository";
import { BotsRepository } from "../database/repositories/BotsRepository";
import { StreamsRepository } from "../database/repositories/StreamsRepository";
import { LogRepository } from "../database/repositories/LogRepository";
import { BotArenaRepository } from "../database/repositories/BotArenaRepository";
import { BotGameRepository } from "../database/repositories/BotGameRepository";
import { RobotsUserRepository } from "../database/repositories/RobotsUserRepository";
import { UserGameRepository } from "../database/repositories/UserGameRepository";
import { SessionRepository } from "../database/repositories/SessionRepository";
import { ConnectedUserRepository } from "../database/repositories/ConnectedUserRepository";
import { GeoIpRepository } from "../database/repositories/GeoIpRepository";
import { GeoIpUserRepository } from "../database/repositories/GeoIpUserRepository";
import { ConnectedUserGeoipRepository } from "../database/repositories/ConnectedUserGeoipRepository";


export default abstract class IServiceFactory {
    public abstract getUserRepository() : UserRepository;
    public abstract getPlayerRepository() : PlayerRepository;
    public abstract getGameRepository(): GameRepository;
    public abstract getArenaRepository(): ArenaRepository;
    public abstract getBotsRepository(): BotsRepository;
    public abstract getBotsArenaRepository(): BotArenaRepository;
    public abstract getStreamsRepository(): StreamsRepository;
    public abstract getLogRepository(): LogRepository;
    public abstract getBotGameRepository(): BotGameRepository;
    public abstract getBotUserRepository(): RobotsUserRepository;
    public abstract getUserGameRepository(): UserGameRepository;
    public abstract getSessionRepository(): SessionRepository;
    public abstract getUserConnectedRepository(): ConnectedUserRepository;
    public abstract getGeoIpRepository(): GeoIpRepository;
    public abstract getGeopIpUserRepository(): GeoIpUserRepository;
    public abstract getUserConnectedGeoIpRepository(): ConnectedUserGeoipRepository;
}
