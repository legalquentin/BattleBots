import { AbstractEntity } from "./AbstractEntity";
import { Column, ManyToOne, JoinColumn, Entity, OneToMany } from "typeorm";
import UserEntity from "./UserEntity";
import { RobotsEntity } from "./RobotsEntity";
import { IsInt, IsString } from "class-validator";

@Entity({
    name: "player"
})
export class PlayerEntity extends AbstractEntity {
    @Column({name: "total_points"})
    @IsInt()
    public total_points?: number;

    @JoinColumn({name: "user_id"})
    @ManyToOne(type => UserEntity, user => user.players, {
        eager: true
    })
    public user: UserEntity;

    @Column({name: "name"})
    @IsString()
    public name?: string;

    @OneToMany(type => RobotsEntity, robotEntity => robotEntity.player)
    public robots?:  Array<RobotsEntity>;
}