import { GameService } from "../GameService";
import { Inject, Singleton } from "typescript-ioc";
import IServiceFactory from "../IServiceFactory";
import { GameEntity } from "../../database/entities/GameEntity";
import { EGameStatus } from "../../resources/EGameStatus";

@Singleton
export class GameServiceImpl implements GameService {

    @Inject
    private serviceFactory: IServiceFactory;

    public async create(game: GameEntity): Promise<GameEntity> {
        game.game_status = EGameStatus.CREATED;
        return this.saveOrUpdate(game);
    }
 
    public async start(id: number): Promise<GameEntity> {
        const game = await this.findOne(id);

        game.game_status = EGameStatus.STARTED;
        return this.saveOrUpdate(game);
    }
    
    public async stop(id: number): Promise<GameEntity> {
        const game = await this.findOne(id);

        game.game_status = EGameStatus.STOPPED;
        return this.saveOrUpdate(game);
    }

    public async end(id: number): Promise<GameEntity> {
        const game = await this.findOne(id);

        game.game_status = EGameStatus.ENDED;
        return this.saveOrUpdate(game);
    }

    public async saveOrUpdate(game: GameEntity): Promise<GameEntity>
    {
            try {
                if (game.id){

                    const toFind = await this.serviceFactory.getGameRepository().findOne(game.id);

                    toFind.game_name = game.game_name;
                    toFind.game_status = game.game_status;
                    toFind.arena = game.arena;
                    await this.serviceFactory.getGameRepository().update(toFind.id, toFind);
                    return (toFind);
                }
                else {
                    const saved = await this.serviceFactory.getGameRepository().save(game);
        
                    return (saved);
                }
            }
            catch (e){
                throw e;
            }
    }

    public async deleteOne(id: number): Promise<Boolean> {
        try {
            const game = await this.serviceFactory.getGameRepository().findOne(id);
        
            if (game){
                await this.serviceFactory.getGameRepository().delete(game.id);
                return (true);
            }
            return (false);
        }
        catch (e){
            return (false);
        }
    }

    public async findAll(): Promise<Array<GameEntity>> {
        return (this.serviceFactory.getGameRepository().find());
    }

    public async findOne(id: number): Promise<GameEntity> {
        return (this.serviceFactory.getGameRepository().findOne(id));
    }
}
