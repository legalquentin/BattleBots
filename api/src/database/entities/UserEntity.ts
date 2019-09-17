import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';

@Entity({ name: 'User' })
export default class UserEntity extends AbstractEntity {
    @Column({ name: 'firstname', length: 255 })
    public firstname: string;

    @Column({ name: 'lastname', length: 255 })
    public lastname: string;
    
    @Column({ type: 'text', name: 'hash' })
    public hash: string;

    @Column({ type: 'text', name: 'salt' })
    public salt: string;
}