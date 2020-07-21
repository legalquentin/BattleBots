import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { LogEntity } from './LogEntity';
import { ERolesStatus } from '../../resources/ERolesStatus';
import { RobotsUserEntity } from './RobotsUserEntity';
import { GameUserEntity } from './GameUserEntity';
import { SessionEntity } from './SessionEntity';
import { ConnectedUserEntity } from './ConnectedUserEntity';
import { GeoIpUserEntity } from './GeoIpUserEntity';

@Entity({ name: 'users' })
export default class UserEntity extends AbstractEntity {

    @Column({ name: 'firstname' })
    public firstname: string;

    @Column({ name: 'lastname' })
    public lastname: string;

    @Column({name: "roles"})
    public roles: ERolesStatus;

    @Column({ name: 'hash' })
    public hash: string;

    @Column({ name: "email", unique: true })
    public email: string;

    @Column({ name: "pseudo", unique: true })
    public pseudo: string;

    @Column({ name: "address" })
    public address: string;

    @OneToMany(type => LogEntity, log => log.user, {
        lazy: true
    })
    public logs?: Array<LogEntity>;

    @OneToMany(type => RobotsUserEntity, robotUserEntity => robotUserEntity.user, {
        lazy: true
    })
    public robotsUser?: Array<RobotsUserEntity>;

    @OneToMany(type => GameUserEntity, gameUserEntity => gameUserEntity.user, {
        lazy: true
    })
    public gameUsers?: Array<GameUserEntity>;

    @OneToMany(type => SessionEntity, session => session.player, {
        lazy: true
    })
    public sessions?: Array<SessionEntity>;

    @OneToMany(type => ConnectedUserEntity, conn => conn.user, {
        lazy: true
    })
    public connectedUsers?: Array<ConnectedUserEntity>;

    @OneToMany(type => GeoIpUserEntity, geoip => geoip.user, {
        lazy: true
    })
    public geoips?: Array<GeoIpUserEntity>;

}
