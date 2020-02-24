import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "robots"
})
export class RobotsEntity extends AbstractEntity {
    @Column({name: "bot_ip"})
    public botIp: string;

    @Column({name: "running"})
    public running: number;

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

    @Column({name: "player_id"})
    public playerId: number;
}
