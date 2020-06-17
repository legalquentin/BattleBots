import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { RobotsEntity } from './RobotsEntity';
import { LogEntity } from './LogEntity';
import { ERolesStatus } from '../../resources/ERolesStatus';
import { GeoIpEntity } from './GeoIpEntity';
import { GameInfoEntity } from './GameInfoEntity';

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

    @OneToMany(type => RobotsEntity, robot => robot.user, {
        cascade: ["remove", "insert", "update"],
        lazy: true
    })
    public robots?: Array<RobotsEntity>;

    @OneToMany(type => LogEntity, log => log.user, {
        lazy: true
    })
    public logs?: Array<LogEntity>;

    @OneToMany(type => GeoIpEntity, geoip => geoip.user, {
        lazy: true
    })
    public geoips?: Array<GeoIpEntity>;

    @OneToMany(type => GameInfoEntity, gameInfoEntity => gameInfoEntity.winner, {
        lazy: true
    })
    public infoWinner?: Array<GameInfoEntity>;

    @OneToMany(type => GameInfoEntity, gameInfoEntity => gameInfoEntity.loser, {
        lazy: true
    })
    public infoLoser?: Array<GameInfoEntity>;
}
