import IUserResource from "../http-models/IUserResource";
import UserEntity from "../database/entities/UserEntity";
import { hashSync } from "bcrypt";
import Config from "./config";

export default class UserEntityAsm {
    public toEntity(user: IUserResource) : UserEntity{
        const entity = new UserEntity();
        const salt = new Config().genSalt();

        entity.pseudo = user.pseudo;
        entity.firstname = user.firstname ? user.firstname : "";
        entity.lastname = user.lastname ? user.lastname : "";
        entity.id = user.id;
        entity.createdAt = new Date(parseInt(user.createdAt, 10));
        entity.updatedAt = new Date(parseInt(user.updatedAt, 10));
        entity.address = user.address? user.address : "";
        entity.salt = `${salt}`;
        entity.email = user.email;
        entity.hash = hashSync(user.password, salt);
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
            email: user.email
        };

        return (resource);
    }

    public toResources(users: UserEntity[]) : IUserResource[]{
        const tab = users.map(user => this.toResource(user));

        return (tab);
    }
}