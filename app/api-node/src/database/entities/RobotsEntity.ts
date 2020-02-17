import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "robots"
})
export class RobotsEntity extends AbstractEntity {
    @Column({name: "bot_ip"})
    botIp: string;

    @Column({name: "running"})
    running: number;

    @Column({name: "taken"})
    taken: number;

    @Column({name: "name"})
    name: string;

    @Column({name: "speed"})
    speed: number;

    @Column({name: "damage"})
    damage: number;

    @Column({name: "fire_rate"})
    fireRate: number;

    @Column({name: "armor"})
    armor: number;

    @Column({name: "player_id"})
    playerId: number;
}
