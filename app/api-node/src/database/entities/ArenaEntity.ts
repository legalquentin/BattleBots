import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column, OneToMany } from "typeorm";
import { GameEntity } from "./GameEntity";
import { RobotsArenaEntity } from "./RobotsArenaEntity";

@Entity({
    name: "arena"
})
export class ArenaEntity extends AbstractEntity {

    @Column({ name: "arena_name" })
    public arena_name: string;

    @Column({ name: "available" })
    public available: number;

    @OneToMany(type => GameEntity, game => game.arena, {
        lazy: true
    })
    public games?: Array<GameEntity>;

    @OneToMany(type => RobotsArenaEntity, robotArena => robotArena.arena, {
        lazy: true
    })
    public robotArena?: Array<RobotsArenaEntity>;

}