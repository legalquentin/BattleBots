import { GameService } from "../GameService";
import { Inject, Singleton } from "typescript-ioc";
import IServiceFactory from "../IServiceFactory";
import { GameEntity } from "../../database/entities/GameEntity";

@Singleton
export class GameServiceImpl implements GameService {

    @Inject
    private serviceFactory: IServiceFactory;

    public async saveOrUpdate(game: GameEntity): Promise<GameEntity>
    {
        if (game.id){
            try {
                const toFind = await this.serviceFactory.getGameRepository().findOne(game.id);

                toFind.game_name = game.game_name;
                toFind.game_status = game.game_status;
                toFind.arena = game.arena;
                await this.serviceFactory.getGameRepository().update(toFind.id, toFind);
                return (toFind);
            }
            catch (e){
                return (Promise.reject(null));
            }
        }
        else {
            return (Promise.reject(null));
        }
    }

    public async deleteOne(id: number): Promise<Boolean> {
        try {
            const game = await this.serviceFactory.getGameRepository().findOne(id);
        
            if (game){
                await this.serviceFactory.getGameRepository().delete(game);
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
