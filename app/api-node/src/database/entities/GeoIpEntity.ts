import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { ConnectedUserGeoipEntity } from "./ConnectedUserGeoipEntity";
import { GeoIpUserEntity } from "./GeoIpUserEntity";

@Entity({
    name: "geoip"
})
export class GeoIpEntity extends AbstractEntity {

    @Column()
    public longitude: number;

    @Column()
    public latitude: number;

    @Column()
    public ip: string;

    @Column()
    public country: string;

    @Column()
    public city: string;

    @Column()
    public timezone: string;

    @OneToMany(type => ConnectedUserGeoipEntity, conn => conn.geoip, {
        lazy: true
    })
    public connectedUserGeoIp: Array<ConnectedUserGeoipEntity>;
    
    @OneToMany(type => GeoIpUserEntity, user => user.geoip, {
        lazy: true
    })
    public geoips?: Array<GeoIpUserEntity>;
    
}