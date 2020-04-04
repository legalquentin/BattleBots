import { PlayerEntity } from "../../database/entities/PlayerEntity";
import IGameProfileResource  from "../../resources/IGameProfileResource";
import { UserResourceAsm } from "./UserResourceAsm";
import { Inject } from "typescript-ioc";
import { ERolesStatus } from "../ERolesStatus";

export class GameProfileResourceAsm {
    @Inject
    private userResourceAsm: UserResourceAsm;

    public toEntity(resource: IGameProfileResource){
        const player: PlayerEntity = {
            total_points: resource.total_points,
            name: resource.name,
            id: resource.id,
            user: this.userResourceAsm.toEntity(resource.user)
        };
        if (resource.user.roles === ERolesStatus.ROLE_ADMIN){
            player.user.roles = ERolesStatus.ROLE_ADMIN;
        }

        return (player);
    }

    public toResource(player: PlayerEntity){
        const p : IGameProfileResource = {
            total_points: player.total_points,
            id: player.id,
            name: player.name
        };

        return (p);
    }

    public toResources(players: Array<PlayerEntity>){
        return players.map(player => this.toResource(player));
    }
}