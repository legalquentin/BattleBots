import { Repository, EntityRepository, EntityManager, getManager, getConnection, EntityMetadata } from "typeorm";
import { PlayerEntity } from "../entities/PlayerEntity";
import { Singleton, Provided, Provider } from "typescript-ioc";

const provider : Provider = {
    get: () => {
        return process.env.NODE_ENV === "test" ? { find: () => {}, save: () => {}} : new PlayerRepository();
    }   
};

@EntityRepository(PlayerEntity)
@Singleton
@Provided(provider)
export class PlayerRepository extends Repository<PlayerEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager("app");
        this.metadata = getConnection("app").getMetadata("player");
    }
}