import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { PlayerEntity } from './PlayerEntity';

@Entity({ name: 'users' })
export default class UserEntity extends AbstractEntity {
    @Column({ name: 'firstname', length: 255 })
    public firstname: string;

    @Column({ name: 'lastname', length: 255 })
    public lastname: string;

    @Column({ type: 'text', name: 'hash' })
    public hash: string;

    @Column({ name: "email", unique: true })
    public email: string;

    @Column({ name: "pseudo", unique: true })
    public pseudo: string;

    @Column({ name: "address" })
    public address: string;

    @OneToMany(type => PlayerEntity, player => player.user, {
        cascade: ["remove"]
    })
    public players?: Array<PlayerEntity>;
}
