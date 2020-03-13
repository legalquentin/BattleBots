import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { PlayerEntity } from './PlayerEntity';
import { IsString, IsEmail } from 'class-validator';

@Entity({ name: 'users' })
export default class UserEntity extends AbstractEntity {
    @Column({ name: 'firstname', length: 255 })
    @IsString()
    public firstname: string;

    @Column({ name: 'lastname', length: 255 })
    @IsString()
    public lastname: string;

    @Column({ type: 'text', name: 'hash' })
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
        cascade: ["remove"]
    })
    public players?: Array<PlayerEntity>;
}
