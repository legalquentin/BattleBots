import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column, OneToMany } from "typeorm";
import { RobotGameEntity } from "./RobotGameEntity";
import { RobotsArenaEntity } from "./RobotsArenaEntity";
import { StreamsEntity } from "./StreamsEntity";
import { RobotsUserEntity } from "./RobotsUserEntity";
import UserEntity from "./UserEntity";

@Entity({
    name: "robots"
})
export class RobotsEntity extends AbstractEntity {

    @Column({name: "bot_ip"})
    public botIp: string;

    @Column({name: "running"})
    public running: number;

    @Column({name: "player_id"})
    public user: UserEntity;

    @Column({name: "taken"})
    public taken: number;

    @Column({name: "name"})
    public name: string;

    @Column({name: "speed"})
    public speed: number;

    @Column({name: "damage"})
    public damage: number;

    @Column({name: "fire_rate"})
    public fireRate: number;

    @Column({name: "armor"})
    public armor: number;

    @OneToMany(type => RobotGameEntity, robotGame => robotGame.bot, {
        lazy: true
    })
    public robotGame?: Array<RobotGameEntity>;

    @OneToMany(type => RobotsUserEntity, robotUserEntity => robotUserEntity.robot, {
        lazy: true
    })
    public robotsUser?: Array<RobotsUserEntity>;

    @OneToMany(type => RobotsArenaEntity, robotArena => robotArena.robot, {
        lazy: true
    })
    public robotsArena?: Array<RobotsArenaEntity>;

    @OneToMany(type => StreamsEntity, streams => streams.robot, {
        lazy: true
    })
    public streams?: Array<StreamsEntity>;
}
