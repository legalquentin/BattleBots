import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "arena"
})
export class ArenaEntity extends AbstractEntity {
    @Column({ name: "arena_name" })
    public arena_name: string;

    @Column({ name: "available" })
    public available: number;
}