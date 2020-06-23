import { Inject } from "typescript-ioc";
import { UserResourceAsm } from "./UserResourceAsm";
import UserEntity from "../../database/entities/UserEntity";
import { ConnectedUserResource } from "../ConnectedUserResource";
import { ConnectedUserEntity } from "../../database/entities/ConnectedUserEntity";

export class ConnectedUserResourceAsm {

    @Inject
    userResourceAsm: UserResourceAsm;

    async toResource(conn: ConnectedUserEntity){
        const resource = new ConnectedUserResource();

        resource.user = await this.userResourceAsm.toResource(conn.user);
        resource.end = conn.endConnected;
        resource.from = conn.startConnected;
        resource.id = conn.id;
        return (resource);
    }

    async toEntity(resource: ConnectedUserResource){
        const connEntity = new ConnectedUserEntity();

        connEntity.user = await this.userResourceAsm.toEntity(resource.user);
        connEntity.endConnected = resource.end;
        connEntity.startConnected = resource.from;
        connEntity.id = resource.id;
        return (connEntity);
    }

    async toResources(conns: Array<ConnectedUserEntity>){
        const resources = [];

        for (let conn of conns){
            resources.push(await this.toResource(conn));
        }
        return (resources);
    }
}