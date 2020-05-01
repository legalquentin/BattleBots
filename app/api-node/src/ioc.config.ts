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
import { BotGameRepository } from './database/repositories/BotGameRepository';
import { Scope } from 'typescript-ioc';

const config =  {
        env: {
            "test": [
                {
                    bind: UserService,
                    to: UserServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: GameService,
                    to: GameServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: ArenaService,
                    to: ArenaServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: AuthenticationService,
                    to: AuthenticationServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: PlayerService,
                    to: PlayerServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: BotsService,
                    to: BotsServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: LogService,
                    to: LogServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: StreamsService,
                    to: StreamsServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: BotArenaService,
                    to: BotArenaServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: IServiceFactory,
                    to: ServiceFactory,
                    scope: Scope.Singleton
                },
                {
                    bind: IConfig,
                    to: Config,
                    scope: Scope.Singleton
                },
                {
                    bind: PlayerRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: UserRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: GameRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: ArenaRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: BotsRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: StreamsRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: LogRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: BotArenaRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: BotGameRepository,
                    to: FakeRepository,
                    scope: Scope.Singleton
                },
            ],
            "production": [
                {
                    bind: UserService,
                    to: UserServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: GameService,
                    to: GameServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: ArenaService,
                    to: ArenaServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: AuthenticationService,
                    to: AuthenticationServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: PlayerService,
                    to: PlayerServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: BotsService,
                    to: BotsServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: LogService,
                    to: LogServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: StreamsService,
                    to: StreamsServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: BotArenaService,
                    to: BotArenaServiceImpl,
                    scope: Scope.Singleton
                },
                {
                    bind: IServiceFactory,
                    to: ServiceFactory,
                    scope: Scope.Singleton
                },
                {
                    bind: IConfig,
                    to: Config,
                    scope: Scope.Singleton
                },
                {
                    bind: PlayerRepository,
                    to: PlayerRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: UserRepository,
                    to: UserRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: GameRepository,
                    to: GameRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: ArenaRepository,
                    to: ArenaRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: BotsRepository,
                    to: BotsRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: StreamsRepository,
                    to: StreamsRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: LogRepository,
                    to: LogRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: BotArenaRepository,
                    to: BotArenaRepository,
                    scope: Scope.Singleton
                },
                {
                    bind: BotGameRepository,
                    to: BotGameRepository,
                    scope: Scope.Singleton
                }
        ]
    }
};

export default config;