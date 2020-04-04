import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { RobotGameEntity } from "./RobotGameEntity";
import { PlayerEntity } from "./PlayerEntity";
import { RobotsArenaEntity } from "./RobotsArenaEntity";
import { StreamsEntity } from "./StreamsEntity";
import { IsString, IsInt } from "class-validator";

@Entity({
    name: "robots"
})
export class RobotsEntity extends AbstractEntity {

    @Column({name: "bot_ip"})
    @IsString()
    public botIp: string;

    @Column({name: "running"})
    @IsInt()
    public running: number;

    @Column({name: "taken"})
    @IsInt()
    public taken: number;

    @Column({name: "name"})
    @IsString()
    public name: string;

    @Column({name: "speed"})
    @IsInt()
    public speed: number;

    @Column({name: "damage"})
    @IsInt()
    public damage: number;

    @Column({name: "fire_rate"})
    @IsInt()
    public fireRate: number;

    @Column({name: "armor"})
    @IsInt()
    public armor: number;

    @JoinColumn({name: "player_id"})
    @ManyToOne(type => PlayerEntity, playerEntity => playerEntity.robots, {
        eager: true
    })
    public player?: PlayerEntity;

    @OneToMany(type => RobotGameEntity, robotGame => robotGame.bot, {
        cascade: ["remove"]
    })
    public robotGame?: Promise<Array<RobotGameEntity>>;

    @OneToMany(type => RobotsArenaEntity, robotArena => robotArena.robot)
    public robotsArena?: Promise<Array<RobotsArenaEntity>>;

    @OneToMany(type => StreamsEntity, streams => streams.robot, {
        cascade: ["insert", "update"]
    })
    public streams?: Promise<Array<StreamsEntity>>;
}
