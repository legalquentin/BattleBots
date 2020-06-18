import UserEntity from "../../database/entities/UserEntity";
import { Container } from "typescript-ioc";
import { BotResourceAsm } from "./BotResourceAsm";
import { IPlayerResource } from "../IPlayerResource";
import { RobotsUserEntity } from "../../database/entities/RobotsUserEntity";

export class PlayerResourceAsm {
    async toResource(user: UserEntity){
        const botResourceAsm = Container.get(BotResourceAsm);
        const resource : IPlayerResource = {
            email: user.email,
            pseudo: user.pseudo,
            id: user.id,
            roles: user.roles,
            bots: []
        };
        if (user.robotsUser){
            for (let botUser of user.robotsUser){
                const bot = botUser.robot;

                resource.bots.push(await botResourceAsm.toResource(bot));
            }
        }
        return (resource);
    }

    async toEntity(resource: IPlayerResource){
        const botResourceAsm = Container.get(BotResourceAsm);
        const entity = new UserEntity();

        entity.id = resource.id;
        entity.email = resource.email;
        entity.roles = resource.roles;
        entity.pseudo = resource.pseudo;
        entity.robotsUser = [];
        if (resource.bots){
            for (let bot of resource.bots){
                const robotUserEntity = new RobotsUserEntity();

                robotUserEntity.robot = await botResourceAsm.toEntity(bot);
                robotUserEntity.user = entity;
                entity.robotsUser.push(robotUserEntity);
            }
        }
        return (entity);
    }
}