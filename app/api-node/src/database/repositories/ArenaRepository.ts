import { Repository, EntityRepository, EntityManager, EntityMetadata, getConnection, getManager } from "typeorm";
import { ArenaEntity } from "../entities/ArenaEntity";
import { Singleton } from "typescript-ioc";
import { connectionName } from "../../service/util/connectionName"; 

@Singleton
@EntityRepository(ArenaEntity)
export class ArenaRepository extends Repository<ArenaEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.metadata = getConnection(connectionName()).getMetadata(ArenaEntity);
        this.manager = getManager(connectionName());
    }

    public async hasArena(game_id: number){
        const entities = await this.createQueryBuilder("arena").leftJoinAndSelect("arena.games", "games").where("games.id = :id", {
            "id": game_id
        }).getMany();

        return (entities && entities.length > 0);
    }

    public async saveOrUpdate(arena: ArenaEntity): Promise<ArenaEntity>
    {
        try {
            if (arena.id) {
                await this.update(arena.id, arena);
                return (arena);
            }
            else {
                const saved = await this.save(arena);
                    
                return (saved);
            }
        }
        catch (e){
            throw e;
        }
    }

    public async getOne(id: number): Promise<ArenaEntity>
    {
        return this.createQueryBuilder("arena").
        leftJoinAndSelect("arena.robotArena", "robotArena").
        leftJoinAndSelect("robotArena.robot", "robot").
        where("arena.id = :id", {
            "id": id
        }).getOne();
    }

    public findAll(): Promise<Array<ArenaEntity>>
    {
        return this.find();
    }
}
