import UserEntity from "../../database/entities/UserEntity";
import IUserResource from "../IUserResource";
import { ERolesStatus } from "../ERolesStatus";
import { GameProfileResourceAsm } from "./GameProfileResourceAsm"; 
import { Inject } from "typescript-ioc";

export class UserResourceAsm {

    @Inject
    private gameProfileResourceAsm : GameProfileResourceAsm;

    public async toResource(user: UserEntity){
        const resource: IUserResource = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            pseudo: user.pseudo,
            id: user.id,
            address: user.address,
            password: user.hash,
            roles: user.roles
        };
        if (user.players){
            resource.gameProfile = (await user.players).map((player) => {
                return this.gameProfileResourceAsm.toResource(player);
            });
        }

        return (resource);
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
        const entity : UserEntity = {
            firstname: resource.firstname,
            lastname: resource.lastname,
            address: resource.address,
            pseudo: resource.pseudo,
            email: resource.email,
            roles: ERolesStatus.ROLE_USER,
            hash: resource.password
        };
        if (!resource.gameProfile){
            resource.gameProfile = [];
        }

        entity.players = Promise.resolve(resource.gameProfile.map(profile => {
            return this.gameProfileResourceAsm.toEntity(profile);
        }));
        return (entity);
    }

    public toAdminEntity(resource: IUserResource){
        const entity = this.toEntity(resource);

        entity.roles = ERolesStatus.ROLE_ADMIN;
        return (entity);
    }
}