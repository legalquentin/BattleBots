import { EntityManager, EntityMetadata, getManager, getConnection, EntityRepository, Repository } from "typeorm";
import { connectionName } from "../../service/util/connectionName";
import { GameUserEntity } from "../entities/GameUserEntity";
import { Singleton, Container } from "typescript-ioc";
import { GameRepository } from "./GameRepository";
import { UserRepository } from "./UserRepository";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";

@Singleton
@EntityRepository(GameUserEntity)
export class UserGameRepository extends Repository<GameUserEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.manager = getManager(connectionName());
        this.metadata = getConnection(connectionName()).getMetadata(GameUserEntity);
    }

    public async deleteByUser(playerId: number){
        try {
            await this.createQueryBuilder("userGame").delete().where("userGame.user_id = :id", {
                id: playerId
            });
        
            return (true);
        }
        catch (e){
            return (false);
        }
    }

    public async deleteByGame(gameId: number){
        try {
            await this.createQueryBuilder("userGame").delete().where("userGame.game_id = :id", {
                id: gameId
            });
        
            return (true);
        }
        catch (e){
            return (false);
        }
    }

    public async linkUserToGame(gameId: number, playerId: number): Promise<GameUserEntity> {
        const userRepository = Container.get(UserRepository);
        const gameRepository = Container.get(GameRepository);
        
        try {
            const game = await gameRepository.findOne(gameId);
            if (!game){
                throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
            }
            const player = await userRepository.findOne(playerId);
            if (!player){
                throw new EntityError(EEntityStatus.NOT_FOUND, "player not found");
            }
            const userGame = new GameUserEntity();

            userGame.game = game;
            userGame.user = player;
            const ret = await this.save(userGame);
            return (ret);
        }
        catch (e){
            throw new EntityError(EEntityStatus.INTERNAL_ERROR, e.message);
        }
    }
}