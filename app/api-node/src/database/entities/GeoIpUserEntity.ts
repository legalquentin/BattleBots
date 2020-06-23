import { Entity, JoinColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { GeoIpEntity } from "./GeoIpEntity";
import UserEntity from "./UserEntity";

@Entity({
    name: "users_geoip"
})
export class GeoIpUserEntity {

    @JoinColumn({
        name: "geoip_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => GeoIpEntity, geo => geo.geoips, {
        eager: true,
        primary: true
    })
    geoip: GeoIpEntity;


    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, user => user.geoips, {
        eager: true,
        primary: true
    })
    user: UserEntity;
    
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