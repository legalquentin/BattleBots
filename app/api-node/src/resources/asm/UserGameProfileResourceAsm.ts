import { Singleton } from "typescript-ioc";
import UserEntity from "../../database/entities/UserEntity";
import { PlayerEntity } from "../..//database/entities/PlayerEntity";
import IUserResource from "../IUserResource";
import IGameProfileResource from "../IGameProfileResource";
import { ERolesStatus } from "../ERolesStatus";

@Singleton
export class UserGameProfileResourceAsm {
    public toPlayerEntity(resource: IGameProfileResource){
        const player = new PlayerEntity();

        player.total_points = resource.total_points;
        player.name = resource.name;
        player.id = resource.id;
        if (resource.user){
            player.user = this.toUserEntity(resource.user);
            if (resource.user.roles === ERolesStatus.ROLE_ADMIN){
                player.user.roles = ERolesStatus.ROLE_ADMIN;
            }
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
        const entity = new UserEntity();

        entity.firstname = resource.firstname;
        entity.lastname = resource.lastname;
        entity.address = resource.address;
        entity.pseudo = resource.pseudo;
        entity.email = resource.email;
        entity.roles = ERolesStatus.ROLE_USER;
        entity.hash = resource.password;
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