import { AbstractEntity } from "./AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity({
    name: "effect"
})
export class EffectEntity extends AbstractEntity {
    @Column({ name: "name", unique: true})
    public name: string;

    @Column({name: "formula"})
    public formula: string;

    @Column({name: "duration"})
    public duration: number;
}