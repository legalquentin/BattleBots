import { SpellEntity } from "../../src/database/entities/SpellEntity";

export abstract class ISpellUtils {
    abstract formula(spell: SpellEntity);
}