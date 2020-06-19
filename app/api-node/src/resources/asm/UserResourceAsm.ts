import UserEntity from "../../database/entities/UserEntity";
import IUserResource from "../IUserResource";
import { ERolesStatus } from "../ERolesStatus";
import { Singleton, Container } from "typescript-ioc";
import { UserGameProfileResourceAsm } from "./UserGameProfileResourceAsm";
import { IPlayerResource } from "../IPlayerResource";
import { IBotsResource } from "../IBotsResource";

@Singleton
export class UserResourceAsm {
    private userGameProfileResourceAsm: UserGameProfileResourceAsm;

    constructor(){
        this.userGameProfileResourceAsm = Container.get(UserGameProfileResourceAsm);
    }

    public async toResource(user: UserEntity){
        return this.userGameProfileResourceAsm.toUserResource(user);
    }

    public async AddBotResource(bots: Array<IBotsResource>, player: IPlayerResource){
        
        player.botSpecs = bots.length ? bots[0] : null;
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