import { SpellEntity } from "../../database/entities/SpellEntity";
import { Singleton, Provides } from "typescript-ioc";
import { ISpellUtils } from "../ISpellUtils";

@Singleton
@Provides(ISpellUtils)
export class SpellUtils {
    public formula(spell: SpellEntity){
    }
}