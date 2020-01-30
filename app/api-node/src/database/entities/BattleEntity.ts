import { Entity, Column, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import UserBattleEntity from "./UserBattleEntity";

@Entity({ name: "battle" })
export class BattleEntity extends AbstractEntity {
    @Column({ name : "name", unique: false })
    public name : string;

    @OneToMany(type => UserBattleEntity, userBattle => userBattle.battle, {
        eager: true
    })
    public userBattles: Array<UserBattleEntity>; 
}