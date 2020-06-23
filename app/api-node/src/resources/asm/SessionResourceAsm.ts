import { SessionEntity } from "../../database/entities/SessionEntity";
import { IContextBotResource } from "../IContextBotResource";
import UserEntity from "../../database/entities/UserEntity";
import { GameEntity } from "../../database/entities/GameEntity";
import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import { Singleton, Inject } from "typescript-ioc";
import { ISessionResource } from "../ISessionResource";
import { GameResourceAsm } from "./GameResourceAsm";
import { BotResourceAsm } from "./BotResourceAsm";
import { UserResourceAsm } from "./UserResourceAsm";
import { StreamsResourceAsm } from "./StreamsResourceAsm";

@Singleton
export class SessionResourceAsm {

    @Inject
    gameResourceAsm : GameResourceAsm;

    @Inject
    botResourceAsm: BotResourceAsm;

    @Inject
    userResourceAsm: UserResourceAsm;

    @Inject
    streamResourceAsm: StreamsResourceAsm;

    toResource(session: SessionEntity){
        const resource: IContextBotResource = {
            energy: session.botEnergy,
            heat: session.botHeat
        };

        return (resource);
    }

    async toFullResource(session: SessionEntity){
        const resource: IContextBotResource = {
            energy: session.botEnergy,
            heat: session.botHeat,
            bot: await this.botResourceAsm.toResource(session.bot),
            user: await this.userResourceAsm.toResource(session.player),
            stream: await this.streamResourceAsm.toResource(session.stream)
        };

        return (resource);
    }

    async toSessionResources(sessions: Array<SessionEntity>){
        const sessionResource : ISessionResource = {};

        sessionResource.game = await this.gameResourceAsm.toResource(sessions[0].game);
        sessionResource.list = [];
        for (let session of sessions){
            const contextBot = await this.toFullResource(session);

            sessionResource.list.push(contextBot);
        }
        return (sessionResource);
    }

    toEntity(session: IContextBotResource){
        const entity = new SessionEntity();

        entity.botEnergy = session.energy;
        entity.botHeat = session.heat;
        if (session.user){
            const userEntity = new UserEntity();

            userEntity.id = session.user.id;
            entity.player = userEntity;
        }
        if (session.game){
            const gameEntity = new GameEntity();

            gameEntity.id = session.game.id;
            entity.game = gameEntity;
        }
        if (session.bot){
            const bot = new RobotsEntity();

            bot.id = session.bot.id;
            entity.bot = bot;
        }
        if (session.stream){
            const stream = new StreamsEntity();

            stream.id = session.stream.id;
            entity.stream = stream;
        }
        return (entity);
    }
}