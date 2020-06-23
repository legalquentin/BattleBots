import { AbstractEntity } from "./AbstractEntity";
import UserEntity from "./UserEntity";
import { JoinColumn, ManyToOne, Column, Entity, OneToMany } from "typeorm";
import { ConnectedUserGeoipEntity } from "./ConnectedUserGeoipEntity";

@Entity({
    name: "connected_users"
})
export class ConnectedUserEntity extends AbstractEntity {
    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, user => user.connectedUsers, {
        eager: true
    })
    public user: UserEntity;

    @Column({
        name: "start_connected"
    })
    public startConnected: Date;

    @Column({
        name: "end_connected"
    })
    public endConnected: Date;

    @OneToMany(type => ConnectedUserGeoipEntity, conn => conn.connectedUser, {
        lazy: true
    })
    public connectedUserGeoIp: Array<ConnectedUserGeoipEntity>;
}
