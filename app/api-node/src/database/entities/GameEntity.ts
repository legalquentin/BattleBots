import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "games"
})
export class GameEntity extends AbstractEntity {
    @Column({ name: "game_name", nullable: false })
    game_name: string;

    @Column({ name: "arena_id", nullable: false })
    arena_id: number;

    @Column({ name: "game_status", nullable: false })
    game_status: number;
}
