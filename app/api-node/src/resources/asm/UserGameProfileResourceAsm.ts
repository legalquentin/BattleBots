import { Singleton } from "typescript-ioc";
import UserEntity from "../../database/entities/UserEntity";
import { PlayerEntity } from "../..//database/entities/PlayerEntity";
import IUserResource from "../IUserResource";
import IGameProfileResource from "../IGameProfileResource";
import { ERolesStatus } from "../ERolesStatus";

@Singleton
export class UserGameProfileResourceAsm {
    public toPlayerEntity(resource: IGameProfileResource){
        const player: PlayerEntity = {
            total_points: resource.total_points,
            name: resource.name,
            id: resource.id,
            user: this.toUserEntity(resource.user)
        };

        if (resource.user.roles === ERolesStatus.ROLE_ADMIN){
            player.user.roles = ERolesStatus.ROLE_ADMIN;
        }
        return (player);
    }

    public async toPlayerResource(player: PlayerEntity){
        const p : IGameProfileResource = {
            total_points: player.total_points,
            id: player.id,
            name: player.name,
        };

        if (player.user){
            let id = player.user.id;

            player.user.id = null;
            p.user = await this.toUserResource(player.user);
            p.user.id = id;
        }
        return (p);
    }

    public toUserEntity(resource: IUserResource){
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
            return this.toPlayerEntity(profile);
        }));
        return (entity);
    }

    public async toUserResource(user: UserEntity){
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

        if (user.players != null){
            const players = await user.players;
            const profiles = await (async () => {
                const profiles = [];

                for (let player of players){
                    delete player.user;
                    profiles.push(await this.toPlayerResource(player));
                }
                return (profiles);
            })();
        
            resource.gameProfile  =  profiles
        }
        return (resource);
    }
}