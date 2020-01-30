import { Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { BattleEntity } from "./BattleEntity";
import UserEntity from './UserEntity';

@Entity({ name: "user_battle" })
export default class UserBattleEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    public id: number;

    @Column({ name: "created_at" })
    public createdAt: Date;

    @JoinColumn({ name: "battle_id" })
    @OneToOne(type => BattleEntity, battle => battle)
    public battle: BattleEntity;

    @JoinColumn({ name: "user_id" })
    @OneToOne(type => UserEntity, user => user, {
        eager: true
    })
    public user: UserEntity;
}
