import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "robots_arena"
})
export class RobotsArenaEntity  {
    @Column({name: "id"})
    id: number;

    @Column({name: "robot_id"})
    robotId: number;

    @Column({name: "arena_id"})
    arenaId: number;
}