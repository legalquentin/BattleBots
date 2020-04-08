import { PlayerRepository } from './database/repositories/PlayerRepository';
import { UserRepository } from './database/repositories/UserRepository';
import { GameRepository } from './database/repositories/GameRepository';
import { FakeRepository } from './database/repositories/FakeRepository';
import { UserService } from './service/UserService';
import { UserServiceImpl } from './service/impl/UserServiceImpl';
import IServiceFactory from './service/IServiceFactory';
import ServiceFactory from './service/impl/ServiceFactory';
import IConfig from './service/IConfig';
import Config from './service/impl/Config';
import { GameService } from './service/GameService';
import { GameServiceImpl } from './service/impl/GameServiceImpl';
import { ArenaService } from './service/ArenaService';
import { ArenaServiceImpl } from './service/impl/ArenaServiceImpl';
import { AuthenticationService } from './service/AuthenticationService';
import { AuthenticationServiceImpl } from './service/impl/AuthenticationServiceImpl';
import { PlayerService } from './service/PlayerService';
import { PlayerServiceImpl } from './service/impl/PlayerServiceImpl';
import { ArenaRepository } from './database/repositories/ArenaRepository';
import { BotsRepository } from './database/repositories/BotsRepository';
import { BotsService } from './service/BotsService';
import { BotsServiceImpl } from './service/impl/BotsServiceImpl';
import { LogRepository } from './database/repositories/LogRepository';
import { StreamsRepository } from './database/repositories/StreamsRepository';
import { LogService } from './service/LogService';
import { LogServiceImpl } from './service/impl/LogServiceImpl';
import { StreamsService } from './service/StreamsService';
import { StreamsServiceImpl } from './service/impl/StreamsServiceImpl';
import { BotArenaRepository } from './database/repositories/BotArenaRepository';
import { BotArenaService } from './service/BotArenaService';
import { BotArenaServiceImpl } from './service/impl/BotArenaServiceImpl';

const config =  {
        env: {
            "test": [
                {
                    bind: PlayerRepository,
                    to: FakeRepository 
                },
                {
                    bind: UserRepository,
                    to: FakeRepository
                },
                {
                    bind: GameRepository,
                    to: FakeRepository
                },
                {
                    bind: ArenaRepository,
                    to: FakeRepository
                },
                {
                    bind: BotsRepository,
                    to: FakeRepository
                },
                {
                    bind: StreamsRepository,
                    to: FakeRepository
                },
                {
                    bind: LogRepository,
                    to: FakeRepository
                },
                {
                    bind: BotArenaRepository,
                    to: FakeRepository
                }
            ],
            "app": [
                {
                    bind: UserService,
                    to: UserServiceImpl
                },
                {
                    bind: GameService,
                    to: GameServiceImpl
                },
                {
                    bind: ArenaService,
                    to: ArenaServiceImpl
                },
                {
                    bind: AuthenticationService,
                    to: AuthenticationServiceImpl
                },
                {
                    bind: PlayerService,
                    to: PlayerServiceImpl
                },
                {
                    bind: BotsService,
                    to: BotsServiceImpl
                },
                {
                    bind: LogService,
                    to: LogServiceImpl
                },
                {
                    bind: StreamsService,
                    to: StreamsServiceImpl
                },
                {
                    bind: BotArenaService,
                    to: BotArenaServiceImpl
                },
                {
                    bind: IServiceFactory,
                    to: ServiceFactory
                },
                {
                    bind: IConfig,
                    to: Config
                },
                {
                    bind: PlayerRepository,
                    to: PlayerRepository
                },
                {
                    bind: UserRepository,
                    to: UserRepository
                },
                {
                    bind: GameRepository,
                    to: GameRepository
                },
                {
                    bind: ArenaRepository,
                    to: ArenaRepository
                },
                {
                    bind: BotsRepository,
                    to: BotsRepository
                },
                {
                    bind: StreamsRepository,
                    to: StreamsRepository
                },
                {
                    bind: LogRepository,
                    to: LogRepository
                },
                {
                    bind: BotArenaRepository,
                    to: BotArenaRepository
                }
        ]
    }
};

export default config;