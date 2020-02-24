import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "games"
})
export class GameEntity extends AbstractEntity {
    @Column({ name: "game_name", nullable: false })
    public game_name: string;

    @Column({ name: "arena_id", nullable: false })
    public arena_id: number;

    @Column({ name: "game_status", nullable: false })
    public game_status: number;
}
