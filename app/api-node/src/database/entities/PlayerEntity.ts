import { AbstractEntity } from "./AbstractEntity";
import { Column, Entity } from "typeorm";


@Entity({
    name: "player"
})
export class PlayerEntity extends AbstractEntity {

    @Column({name: "total_points"})
    public total_points?: number;

    /*
    @JoinColumn({name: "user_id"})
    @ManyToOne(type => UserEntity, user => user.players, {
        eager: true
    })
    public user: UserEntity;

    @Column({name: "name"})
    public name?: string;

    @OneToMany(type => RobotsEntity, robotEntity => robotEntity.player, {
        lazy: true
    })
    public robots?:  Promise<Array<RobotsEntity>>;
    */
}