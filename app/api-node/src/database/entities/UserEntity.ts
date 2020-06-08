import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { PlayerEntity } from './PlayerEntity';
import { LogEntity } from './LogEntity';
import { ERolesStatus } from '../../resources/ERolesStatus';

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

    @OneToMany(type => PlayerEntity, player => player.user, {
        cascade: ["remove", "insert", "update"]
    })
    public players?: Promise<Array<PlayerEntity>>;

    @OneToMany(type => LogEntity, log => log.user)
    public logs?: Promise<Array<LogEntity>>;
}
