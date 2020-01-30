import { SpellResource } from "../http-models/SpellResource";
import { SpellEntity } from "../database/entities/SpellEntity";

export default class SpellEntityAsm {
    public toEntity(resource: SpellResource){
        const entity = new SpellEntity();

        entity.createdAt = new Date(parseInt(resource.createdAt, 10));
        entity.updatedAt = new Date(parseInt(resource.updatedAt, 10));
        entity.id = resource.id;
        entity.formula = resource.formula;
        entity.name = resource.name;
        return (entity);
    }

    public toResource(entity: SpellEntity){
        const resource = new SpellResource();

        resource.createdAt = entity.createdAt.getTime().toString();
        resource.updatedAt = entity.updatedAt.getTime().toString();
        resource.formula = entity.formula;
        resource.name = entity.name;
        resource.id = entity.id;
        return (resource);
    }

    public toResources(entities: SpellEntity[]){
        const tab = entities.map(entity => this.toResource(entity));

        return (tab);
    }
}