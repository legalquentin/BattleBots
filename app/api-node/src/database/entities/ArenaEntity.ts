import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column, OneToMany } from "typeorm";
import { GameEntity } from "./GameEntity";
import { IsString, IsInt } from "class-validator";
import { RobotsArenaEntity } from "./RobotsArenaEntity";

@Entity({
    name: "arena"
})
export class ArenaEntity extends AbstractEntity {

    @Column({ name: "arena_name" })
    @IsString()
    public arena_name: string;

    @Column({ name: "available" })
    @IsInt()
    public available: number;

    @OneToMany(type => GameEntity, game => game.arena, {
        cascade: ["remove"]
    })
    public games?: Promise<Array<GameEntity>>;

    @OneToMany(type => RobotsArenaEntity, robotArena => robotArena.arena, {
        cascade: ["insert", "update", "remove"]
    })
    public robotArena?: Promise<Array<RobotsArenaEntity>>;
}