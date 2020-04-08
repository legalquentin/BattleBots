import { GameService } from "../GameService";
import { Inject, Singleton } from "typescript-ioc";
import IServiceFactory from "../IServiceFactory";
import { GameEntity } from "../../database/entities/GameEntity";
import { EGameStatus } from "../../resources/EGameStatus";
import { RobotGameEntity } from "../../database/entities/RobotGameEntity";

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

        if (!game){
            return (null);
        }
        game.game_status = EGameStatus.STARTED;
        return this.saveOrUpdate(game);
    }
    
    public async stop(id: number): Promise<GameEntity> {
        const game = await this.findOne(id);

        if (!game){
            return (null);
        }
        game.game_status = EGameStatus.STOPPED;
        return this.saveOrUpdate(game);
    }

    public async end(id: number): Promise<GameEntity> {
        const game = await this.findOne(id);

        if (!game){
            return (null);
        }
        game.game_status = EGameStatus.ENDED;
        return this.saveOrUpdate(game);
    }

    public async saveOrUpdate(game: GameEntity): Promise<GameEntity>
    {
        const botGameList = await game.robots;
        const streamList = await game.streams;

        this.deleteAllBotGame(game);
        for (let botGame of botGameList){
            await this.serviceFactory.getBotGameRepository().save(botGame);
        }
        for (let stream of streamList){
            const isSaved = await this.serviceFactory.getStreamsRepository().findOne(stream.id) != null;

            if (!isSaved){
                await this.serviceFactory.getStreamsRepository().save(stream);
            }
            else{
                await this.serviceFactory.getStreamsRepository().update(stream.id, stream);
            }
        }
        if (game.arena){
            if (game.arena.id){
                const isSaved = await this.serviceFactory.getArenaRepository().findOne(game.arena.id) != null;

                if (!isSaved){
                    await this.serviceFactory.getArenaRepository().save(game.arena);
                }
                else{
                    await this.serviceFactory.getArenaRepository().update(game.arena.id, game.arena);
                }
            }
        }
        try {
                if (game.id){
                    await this.serviceFactory.getGameRepository().update(game.id, game);
                    return (game);
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
            throw e;
        }
    }

    public async findAll(): Promise<Array<GameEntity>> {
        return (this.serviceFactory.getGameRepository().find());
    }

    public async findOne(id: number): Promise<GameEntity> {
        return (this.serviceFactory.getGameRepository().
        createQueryBuilder("game").
        leftJoinAndSelect("game.robots", "robots").
        leftJoinAndSelect("robots.bot", "bot").
        leftJoinAndSelect("game.arena", "arena").
        leftJoinAndSelect("game.streams", "streams").
        where("game.id = :game_id", {
            "game_id": id
        }).
        getOne());
    }

    public deleteAllBotGame(game: GameEntity){
        return (this.serviceFactory.getBotGameRepository().createQueryBuilder("botGame").from(RobotGameEntity, "robotGame").where("robotGame.game_id = :id", {
            "id": game.id
        }).execute());
    }
}
