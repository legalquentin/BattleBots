import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Entity } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { LogEntity } from "./LogEntity";

@Entity({
    name: "geoip"
})
export class GeoIpEntity extends AbstractEntity {

    @JoinColumn({
        name: "log_id",
        referencedColumnName: "id"
    })
    @OneToOne(type => LogEntity, log => log.geoips, {
        nullable: true,
        eager: true
    })
    public log: LogEntity;

    @Column()
    public longitude: number;

    @Column()
    public latitude: number;

    @Column()
    public country: string;

    @Column()
    public city: string;

    @Column()
    public timezone: string;
}