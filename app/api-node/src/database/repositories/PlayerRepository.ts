import { Repository, EntityRepository, EntityManager, getManager, getConnection, EntityMetadata } from "typeorm";
import { PlayerEntity } from "../entities/PlayerEntity";
import { Singleton } from "typescript-ioc";

@EntityRepository(PlayerEntity)
@Singleton
export class PlayerRepository extends Repository<PlayerEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(PlayerEntity);
    }

    public async saveOrUpdate(player: PlayerEntity): Promise<PlayerEntity> {
        try {
            if (player.id){
                await this.update(player.id, player);
                return (player);
            }
            else {
                await this.save(player);
                return (player);
            }
        }
        catch (e){
            throw e;
        }
    }

}