import { AbstractEntity } from "./AbstractEntity";
import { Column, ManyToOne, JoinColumn, Entity } from "typeorm";
import UserEntity from "./UserEntity";

@Entity({
    name: "player"
})
export class PlayerEntity extends AbstractEntity {
    @Column({name: "total_points"})
    public total_points: number;

    @JoinColumn({name: "user_id"})
    @ManyToOne(type => UserEntity, user => user.players, {
        eager: true
    })
    public user: UserEntity;
}