import { SessionEntity } from "../../database/entities/SessionEntity";
import { IContextBotResource } from "../IContextBotResource";
import UserEntity from "../../database/entities/UserEntity";
import { GameEntity } from "../../database/entities/GameEntity";
import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { StreamsEntity } from "../../database/entities/StreamsEntity";
import { Singleton } from "typescript-ioc";

@Singleton
export class SessionResourceAsm {
    toResource(session: SessionEntity){
        const resource: IContextBotResource = {
            energy: session.botEnergy,
            heat: session.botHeat
        };

        return (resource);
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