import { Repository, EntityRepository, EntityMetadata, EntityManager, getConnection, getManager } from "typeorm";
import { RobotsEntity } from "../entities/RobotsEntity";
import { Singleton, Container } from "typescript-ioc";
import { EntityError } from "../../../lib/EntityError";
import { EEntityStatus } from "../../../lib/EEntityStatus";
import { StreamsRepository } from "./StreamsRepository";
import { connectionName } from "../../service/util/connectionName"; 
import { UserRepository } from "./UserRepository";

@Singleton
@EntityRepository(RobotsEntity)
export class BotsRepository extends Repository<RobotsEntity> {
    public manager: EntityManager;
    public metadata: EntityMetadata;

    constructor(){
        super();
        this.metadata = getConnection(connectionName()).getMetadata(RobotsEntity);
        this.manager = getManager(connectionName());
    }

    public async hasBots(game_id: number){
        const entities = await this.createQueryBuilder("bots").leftJoinAndSelect("bots.robotGame", "robotGame").leftJoinAndSelect("robotGame.game", "game").where("game.id = :id", {
            id: game_id
        }).getMany();

        return (entities && entities.length > 0);
    }

    public async hasBotsByArena(arena_id: number){
        const entities = await this.createQueryBuilder("bots").leftJoinAndSelect("bots.robotsArena", "robotsArena").leftJoinAndSelect("robotsArena.arena", "arena").where("arena.id = :id", {
            "id": arena_id
        }).getMany();
  
        return (entities && entities.length > 0);
    }

    public getOne(id: number): Promise<RobotsEntity>
    {
        return (this.
        createQueryBuilder("bots").
        leftJoinAndSelect("bots.user", "user").
        where("bots.id = :id", {
            "id": id
        }).getOne());
    }

    public async linkBotToPlayer(botId: number, playerId: number): Promise<RobotsEntity> {
        const userRepository = Container.get(UserRepository);
        try {
            const bot = await this.findOne(botId);

            if (!bot){
                throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
            }
            const player = await userRepository.findOne(playerId);

            if (!player){
                throw new EntityError(EEntityStatus.NOT_FOUND, "player not found");
            }
            bot.user = player;
            await this.update(bot.id, bot);
            return (bot);
        }
        catch (e){
            throw new EntityError(EEntityStatus.INTERNAL_ERROR, e.message);
        }
    }

    public async linkBotToStream(botId: number, streamId: number) {
        const streamRepository = Container.get(StreamsRepository);
        const bot = await this.createQueryBuilder("robots").leftJoinAndSelect("robots.streams", "streams").where("robots.id = :id", {
            id: botId
        }).getOne();

        if (!bot){
            throw new EntityError(EEntityStatus.NOT_FOUND, "bot not found");
        }
        const stream = await streamRepository.findOne(streamId);

        if (!stream){
            throw new EntityError(EEntityStatus.NOT_FOUND, "stream not found");
        }
        stream.robot = bot;
        const streams = await bot.streams;
        if (streams){
            for (let s of streams){
                if (s.id === stream.id){
                    throw new EntityError(EEntityStatus.INTERNAL_ERROR, "already join");
                }
            }
            streams.push(stream);
            bot.streams = streams;
        }
        else {
            bot.streams = [
                stream
            ];
        }
        await streamRepository.update(stream.id, stream);
        return (bot);
    }

    public async saveOrUpdate(bots: RobotsEntity): Promise<RobotsEntity>
    {
        try {
            if (bots.id){
                await this.update(bots.id, bots);
            }
            else {
                await this.save(bots);
            }
            return bots;
        }
        catch (e)
        {
            throw e;
        }
    }

    public async findByUser(userId: number): Promise<RobotsEntity[]> {
        const bots = await this.createQueryBuilder().select("robots").from(RobotsEntity, "robots").leftJoinAndSelect("robots.player", "player").leftJoinAndSelect("player.user", "user").where("user.id = :id", {
            id: userId
        }).getMany();
   
        return (bots);
    }
}
