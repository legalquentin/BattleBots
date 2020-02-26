import IUserResource from "../IUserResource";
import UserEntity from "../../database/entities/UserEntity";
import { hashSync } from "bcrypt";
import Config from "../../service/impl/Config";
import { PlayerEntity } from "../../database/entities/PlayerEntity";
import { Singleton, Inject } from "typescript-ioc";

@Singleton
export default class UserAsm {

    @Inject
    config: Config;

    public toEntity(user: IUserResource) : UserEntity{
        const entity = new UserEntity();

        entity.pseudo = user.pseudo;
        entity.firstname = user.firstname ? user.firstname : "";
        entity.lastname = user.lastname ? user.lastname : "";
        entity.id = user.id;
        entity.createdAt = new Date(parseInt(user.createdAt, 10));
        entity.updatedAt = new Date(parseInt(user.updatedAt, 10));
        entity.address = user.address? user.address : "";
        entity.email = user.email;
        entity.hash = hashSync(user.password, this.config.genSalt());
        return (entity);
    }

    public toResource(user : UserEntity) : IUserResource{
        const resource : IUserResource = {
            id: user.id,
            pseudo: user.pseudo,
            firstname: user.firstname,
            lastname: user.lastname,
            createdAt: user.createdAt.getTime().toString(),
            updatedAt: user.createdAt.getTime().toString(),
            address: user.address,
            email: user.email,
            gameProfile: {
                total_points: user.players[0].total_points
            }
        };

        return (resource);
    }

    public toPlayerResource(player: PlayerEntity): IUserResource {
        const resource: IUserResource = {
            id: player.user.id,
            pseudo: player.user.pseudo,
            firstname: player.user.firstname,
            lastname: player.user.lastname,
            createdAt: player.user.createdAt.getTime().toString(),
            updatedAt: player.user.updatedAt.getTime().toString(),
            address: player.user.address,
            email: player.user.email,
            gameProfile: {
                total_points: player.total_points
            }
        };

        return (resource);
    }

    public toPlayerResources(players: Array<PlayerEntity>) : IUserResource[] {
        const tab = players.map(player => this.toPlayerResource(player));

        return (tab);
    }

    public toResources(users: UserEntity[]) : IUserResource[]{
        const tab = users.map(user => this.toResource(user));

        return (tab);
    }
}
