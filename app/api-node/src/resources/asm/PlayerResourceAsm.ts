import UserEntity from "../../database/entities/UserEntity";
import { Container } from "typescript-ioc";
import { BotResourceAsm } from "./BotResourceAsm";
import { IPlayerResource } from "../IPlayerResource";
import { RobotsUserEntity } from "../../database/entities/RobotsUserEntity";

export class PlayerResourceAsm {
    async toResource(user: UserEntity){
        const resource : IPlayerResource = {
            email: user.email,
            pseudo: user.pseudo,
            id: user.id,
            roles: user.roles,
        };
        return (resource);
    }

    async toEntity(resource: IPlayerResource){
        const botResourceAsm = Container.get(BotResourceAsm);
        const entity = new UserEntity();

        entity.id = resource.id;
        entity.email = resource.email;
        entity.roles = resource.roles;
        entity.pseudo = resource.pseudo;
        if (resource.botSpecs){
            const robotUserEntity = new RobotsUserEntity();

            robotUserEntity.robot = await botResourceAsm.toEntity(resource.botSpecs);
            robotUserEntity.user = entity;
            entity.robotsUser = [robotUserEntity];
        }
        return (entity);
    }
}