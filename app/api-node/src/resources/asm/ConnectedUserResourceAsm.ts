import { Inject } from "typescript-ioc";
import { UserResourceAsm } from "./UserResourceAsm";
import { ConnectedUserResource } from "../ConnectedUserResource";
import { ConnectedUserEntity } from "../../database/entities/ConnectedUserEntity";
import { GeoIpResourceAsm } from "./GeoIpResourceAsm";

export class ConnectedUserResourceAsm {

    @Inject
    userResourceAsm: UserResourceAsm;

    @Inject
    geoipResourceAsm: GeoIpResourceAsm;

    async toResource(conn: ConnectedUserEntity){
        const resource = new ConnectedUserResource();

        resource.user = await this.userResourceAsm.toResource(conn.user);
        const tab = await conn.connectedUserGeoIp;
        resource.geoips = [];
        for (let item of tab){
            resource.geoips.push(await this.geoipResourceAsm.toResource(item.geoip));
        }
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