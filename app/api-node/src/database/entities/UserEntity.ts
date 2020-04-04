import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { PlayerEntity } from './PlayerEntity';
import { IsString, IsEmail } from 'class-validator';
import { LogEntity } from './LogEntity';
import { ERolesStatus } from '../../resources/ERolesStatus';

@Entity({ name: 'users' })
export default class UserEntity extends AbstractEntity {

    @Column({ name: 'firstname', length: 255 })
    @IsString()
    public firstname: string;

    @Column({ name: 'lastname', length: 255 })
    @IsString()
    public lastname: string;

    @Column({name: "roles"})
    @IsString()
    public roles: ERolesStatus;

    @Column({ name: 'hash' })
    @IsString()
    public hash: string;

    @Column({ name: "email", unique: true })
    @IsEmail()
    public email: string;

    @Column({ name: "pseudo", unique: true })
    @IsString()
    public pseudo: string;

    @Column({ name: "address" })
    @IsString()
    public address: string;

    @OneToMany(type => PlayerEntity, player => player.user, {
        cascade: ["remove", "insert", "update"]
    })
    public players?: Promise<Array<PlayerEntity>>;

    @OneToMany(type => LogEntity, log => log.user)
    public logs?: Promise<Array<LogEntity>>;
}
