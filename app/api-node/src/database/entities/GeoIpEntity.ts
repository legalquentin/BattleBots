import { Column, OneToOne, JoinColumn, Entity } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { LogEntity } from "./LogEntity";
import UserEntity from "./UserEntity";

@Entity({
    name: "geoip"
})
export class GeoIpEntity extends AbstractEntity {

    @JoinColumn({
        name: "log_id",
        referencedColumnName: "id"
    })
    @OneToOne(type => UserEntity, user => user.geoips)
    public user: UserEntity;

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
}