import { Repository, EntityManager, EntityMetadata, getManager, getConnection, EntityRepository } from "typeorm";
import { RobotGameEntity } from "../entities/RobotGameEntity";
import { Singleton, Container } from "typescript-ioc";
import { BotsRepository } from "./BotsRepository";
import { GameRepository } from "./GameRepository";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import { GameEntity } from "../entities/GameEntity";
import { connectionName } from "../../service/util/connectionName"; 

@Singleton
@EntityRepository(RobotGameEntity)
export class BotGameRepository extends Repository<RobotGameEntity> {
    manager: EntityManager;
    metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(RobotGameEntity);
    }

    async linkBotToGame(botId: number, gameId: number){
        const botRepository = Container.get(BotsRepository);
        const gameRepository = Container.get(GameRepository);

        console.log("enter");
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
        const robotGame: RobotGameEntity = {
            bot: bot,
            game: game
        };
        if (await botRepository.hasBots(gameId)){
            const robotGames = await game.robots;
            if (robotGames){
                for (let robotGame of robotGames){
                    if (robotGame.bot.id === bot.id){
                        throw new EntityError(EEntityStatus.INTERNAL_ERROR, "already join")
                    }
                }
            }
            game.robots.push(robotGame);
        }
        else {
            game.robots = [ robotGame ];
        }
        console.log(robotGame);
        await this.save(robotGame);
        return (game);
    }
    

    public async deleteAllBotGame(game: GameEntity){
        try {
            await (this.createQueryBuilder().delete().where("game_id = :id", {
                "id": game.id
            }).execute());

            return (true);
        }
        catch (e){
            console.log(e.message);
            return (false);
        }
    }
}
