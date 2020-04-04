import UserEntity from "../../database/entities/UserEntity";
import IUserResource from "../IUserResource";
import { ERolesStatus } from "../ERolesStatus";
import { Singleton, Inject } from "typescript-ioc";
import { UserGameProfileResourceAsm } from "./UserGameProfileResourceAsm";

@Singleton
export class UserResourceAsm {
    @Inject
    private userGameProfileResourceAsm: UserGameProfileResourceAsm;


    public async toResource(user: UserEntity){
        return this.userGameProfileResourceAsm.toUserResource(user);
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

    public toEntity(resource: IUserResource){
        return this.userGameProfileResourceAsm.toUserEntity(resource);
    }

    public toAdminEntity(resource: IUserResource){
        const entity = this.toEntity(resource);

        entity.roles = ERolesStatus.ROLE_ADMIN;
        return (entity);
    }
}