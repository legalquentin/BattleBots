import { ConnectedUserEntity } from "./ConnectedUserEntity";
import { GeoIpEntity } from "./GeoIpEntity";
import { JoinColumn, Column, BeforeInsert, BeforeUpdate, Entity, ManyToOne } from "typeorm";

@Entity({
    name: "connected_users_geoip"
})
export class ConnectedUserGeoipEntity {

    // @JoinColumn({
    //     name: "connected_user_id",
    //     referencedColumnName: "id"
    // })
    // @ManyToOne(type => ConnectedUserEntity, conn => conn.connectedUserGeoIp, {
    //     primary: true,
    //     eager: true
    // })
    // public connectedUser: ConnectedUserEntity;

    @JoinColumn({
        name: "geoip_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => GeoIpEntity, geo => geo.connectedUserGeoIp, {
        primary: true,
        eager: true
    })
    public geoip: GeoIpEntity;
    
    @Column({ name: 'created_at' })
    public createdAt?: Date;

    @Column({ name: 'updated_at'})
    public updatedAt?: Date;

    @BeforeInsert()
    public upCreatedAt(){
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    @BeforeUpdate()
    public upUpdatedAt(){
        this.updatedAt = new Date();
    }

}