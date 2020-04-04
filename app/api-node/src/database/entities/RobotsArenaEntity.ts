import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { RobotsEntity } from "./RobotsEntity";
import { ArenaEntity } from "./ArenaEntity";

@Entity({
    name: "robots_arena"
})
export class RobotsArenaEntity  {
    @JoinColumn({name: "bot_id", referencedColumnName: "id"})
    @ManyToOne(type => RobotsEntity, robot => robot.robotsArena, {
        eager: true,
        cascade: ["insert", "update"],
        primary: true
    })
    public robot?: RobotsEntity;

    @JoinColumn({name: "arena_id", referencedColumnName: "id"})
    @ManyToOne(type => ArenaEntity, arena => arena.robotArena, {
        eager: true,
        cascade: ["insert", "update"],
        primary: true
    })
    public arena?: ArenaEntity;
}
