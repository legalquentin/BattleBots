import { BattleEntity } from "../database/entities/BattleEntity";
import IBattleResource from "../http-models/IBattleResource";

export default class BattleEntityAsm {
    public toEntity(resource: IBattleResource){
        const entity : BattleEntity = new BattleEntity();

        //entity.createdAt = new Date(parseInt(resource.createdAt, 10));
        //entity.id = resource.id;
        entity.name = resource.name;
        //entity.updatedAt = new Date(parseInt(resource.updatedAt, 10));
        return (entity);
    }

    public toResource(entity: BattleEntity): IBattleResource{
        const resource : IBattleResource = {
            id: entity.id,
            name: entity.name,
            token: "",
            createdAt: entity.createdAt.getTime().toString(),
            updatedAt: entity.updatedAt.getTime().toString()
        };

        return (resource);
    }

    public toResources(entities: Array<BattleEntity>){
        const tab : Array<IBattleResource> = entities.map((entity) => this.toResource(entity));

        return (tab);
    }
};