import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "arena"
})
export class ArenaEntity extends AbstractEntity {
    @Column({ name: "arena_name" })
    arena_name: string;

    @Column({ name: "available" })
    available: number;
}