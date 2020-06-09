import UserEntity from "./UserEntity";
import { AbstractEntity } from "./AbstractEntity";
import { Entity, ManyToOne, Column, JoinColumn, OneToOne } from "typeorm";
import { GeoIpEntity } from "./GeoIpEntity";

@Entity({
    name: "log"
})
export class LogEntity extends AbstractEntity{

    @Column({name: "path"})
    public path?: string;

    @Column({name: "method"})
    public method?: string;

    @Column({name: "complete"})
    public complete?: number;

    @Column({name: "body"})
    public body?: string;

    @Column({name: 'start_time'})
    public startTime?: Date;

    @Column({name: 'end_time'})
    public endTime?: Date;

    @Column({name: 'duration'})
    public duration?: Date;

    @Column({name: 'response_code'})
    public responseCode?: number;

    @JoinColumn({
        name: "user",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, user => user.logs, {
        eager: true,
        nullable: true
    })
    public user?: UserEntity;

    @OneToOne(type => GeoIpEntity, ip => ip.log, {
        lazy: true
    })
    public geoips: Array<GeoIpEntity>;
}