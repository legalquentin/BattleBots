import UserEntity from "../../database/entities/UserEntity";
import IUserResource from "../IUserResource";
import { ERolesStatus } from "../ERolesStatus";
import { Singleton, Container } from "typescript-ioc";
import { UserGameProfileResourceAsm } from "./UserGameProfileResourceAsm";
import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { IPlayerResource } from "../IPlayerResource";
import { BotResourceAsm } from "./BotResourceAsm";

@Singleton
export class UserResourceAsm {
    private userGameProfileResourceAsm: UserGameProfileResourceAsm;

    constructor(){
        this.userGameProfileResourceAsm = Container.get(UserGameProfileResourceAsm);
    }

    public async toResource(user: UserEntity){
        return this.userGameProfileResourceAsm.toUserResource(user);
    }

    public async AddBotResource(bot: RobotsEntity, player: IPlayerResource){
        const botResourceAsm = Container.get(BotResourceAsm);
        
        player.botSpecs = await botResourceAsm.toResource(bot);
        return (player);
    }

    public async toResources(users: Array<UserEntity>){
        const resources = (async (users) => {
            const resources = [];

            for (const user of users){
                resources.push(await this.toResource(user));
            }
            return (resources);
        })(users);
        return resources;
    }

    public async toEntity(resource: IUserResource){
        return await this.userGameProfileResourceAsm.toUserEntity(resource);
    }

    public async toAdminEntity(resource: IUserResource){
        const entity = await this.toEntity(resource);

        entity.roles = ERolesStatus.ROLE_ADMIN;
        return (entity);
    }
}