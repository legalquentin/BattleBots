import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { RobotsEntity } from "./RobotsEntity";
import { ArenaEntity } from "./ArenaEntity";

@Entity({
    name: "robots_arena"
})
export class RobotsArenaEntity  {
    @PrimaryGeneratedColumn({name: "id"})
    public id: number;

    @JoinColumn({name: "robot_id"})
    @ManyToOne(type => RobotsEntity, robot => robot.robotArena)
    public robot: RobotsEntity;

    @JoinColumn({name: "arena_id"})
    @ManyToOne(type => ArenaEntity, arena => arena.robotArena)
    public arena: ArenaEntity;
}
