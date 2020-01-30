import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column } from "typeorm";

@Entity({
    name: "spell"
})
export class SpellEntity extends AbstractEntity {
    @Column({name: "name", unique: true})
    public name : string;

    @Column({name: "formula"})
    public formula: string;
}
