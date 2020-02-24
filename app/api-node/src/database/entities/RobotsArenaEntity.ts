import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "robots_arena"
})
export class RobotsArenaEntity  {
    @PrimaryGeneratedColumn({name: "id"})
    public id: number;

    @Column({name: "robot_id"})
    public robotId: number;

    @Column({name: "arena_id"})
    public arenaId: number;
}