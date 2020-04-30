import { Repository, EntityManager, EntityMetadata, getManager, getConnection, EntityRepository } from "typeorm";
import { RobotGameEntity } from "../entities/RobotGameEntity";
import { Singleton, Container } from "typescript-ioc";
import { BotsRepository } from "./BotsRepository";
import { GameRepository } from "./GameRepository";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import { GameEntity } from "../entities/GameEntity";

@Singleton
@EntityRepository(RobotGameEntity)
export class BotGameRepository extends Repository<RobotGameEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(process.env.NODE_ENV);
        this.metadata = getConnection(process.env.NODE_ENV).getMetadata(RobotGameEntity);
    }

    async linkBotToGame(botId: number, gameId: number){
        const botRepository = Container.get(BotsRepository);
        const gameRepository = Container.get(GameRepository);

        const bot = await botRepository.createQueryBuilder("robots").where("robots.id = :id", {
            id: botId
        }).getOne();

        if (!bot){
            throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
        }
        const game = await gameRepository.createQueryBuilder("games").leftJoinAndSelect("games.robots", "robot").leftJoinAndSelect("robot.bot", "bot").where("games.id = :id", {
            id: gameId
        }).getOne();
        if (!game){
            throw new EntityError(EEntityStatus.NOT_FOUND, "game not found");
        }
        const robotGames = await game.robots;
        if (robotGames){
            for (let robotGame of robotGames){
                if (robotGame.bot.id === bot.id){
                    throw new EntityError(EEntityStatus.INTERNAL_ERROR, "already join")
                }
            }
        }
        const robotGame: RobotGameEntity = {
            bot: bot,
            game: game
        };
        await this.save(robotGame);
        return (game);
    }
    

    public deleteAllBotGame(game: GameEntity){
        return (this.createQueryBuilder().delete().from(RobotGameEntity).where("game_id = :id", {
            "id": game.id
        }).execute());
    }
}
