import { BotsService } from "../BotsService";
import { RobotsEntity } from "../../database/entities/RobotsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";
import { StreamsService } from "../StreamsService";

@Singleton
export class BotsServiceImpl implements BotsService {
    @Inject
    private service: IServiceFactory;

    @Inject
    private streamService: StreamsService;

    public async saveOrUpdate(bots: RobotsEntity): Promise<RobotsEntity>
    {
        try {
            if (bots.player){
                if (bots.player.id){
                    await this.service.getPlayerRepository().update(bots.player.id, bots.player);
                }
                else {
                    const ret = await this.service.getPlayerRepository().save(bots.player);
    
                    bots.player.id = ret.id;
                }
            }
            if (bots.streams){
                await this.streamService.deleteByBot(bots.id);
                const streams = await bots.streams;
                delete bots.streams;

                for (let stream of streams){
                    stream.robot = bots;
                    if (stream.id){
                        await this.service.getStreamsRepository().update(stream.id, stream);
                    }
                    else{
                        const ret = await this.service.getStreamsRepository().save(stream);

                        stream.id = ret.id;
                    }
                    delete stream.robot;
                }
                bots.streams = Promise.resolve(streams);
            }
            if (bots.id)
            {
               const toUpdate = new RobotsEntity();

               toUpdate.id = bots.id;
               toUpdate.botIp = bots.botIp;
               toUpdate.damage = bots.damage;
               toUpdate.armor = bots.armor;
               toUpdate.taken = bots.taken;
               toUpdate.speed = bots.speed;
               toUpdate.fireRate = bots.fireRate;
               toUpdate.running = bots.running;
               toUpdate.name = bots.name;
               toUpdate.player = bots.player;
               await this.service.getBotsRepository().update(toUpdate.id, toUpdate);
               return (bots);
            }
            else {
                const saved = await this.service.getBotsRepository().save(bots);

                return (saved);
            }
        }
        catch (e)
        {
            throw e;
        }
    }

    public findOne(id: number): Promise<RobotsEntity>
    {
        return (this.service.getBotsRepository().
        createQueryBuilder("bots").
        leftJoinAndSelect("bots.player", "player").
        where("bots.id = :id", {
            "id": id
        }).getOne());
    }

    public async findAll(): Promise<Array<RobotsEntity>>
    {
        return (this.service.getBotsRepository().find());
    }

    public async deleteOne(id: number) : Promise<Boolean>
    {
        try {
            const bots = await this.findOne(id);

            if (bots)
            {
                await this.service.getBotsRepository().createQueryBuilder("bot").delete().from(RobotsEntity, "bot").where("id = :id", {
                    id: id
                }).execute();
                return (true);
            }
            else
            {
                return (false);
            }
        }
        catch (e)
        {
            throw e;
        }
    }

    public async enable(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.findOne(id);

            bots.running = 1;
            return this.saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }

    public async disable(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.findOne(id);

            bots.running = 0;
            return this.saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }  

    public async take(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.findOne(id);

            bots.taken = 1;
            return this.saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }

    public async release(id: number): Promise<RobotsEntity>
    {
        try {
            const bots = await this.findOne(id);

            bots.taken = 0;
            return this.saveOrUpdate(bots);
        }
        catch (e)
        {
            throw e;
        }
    }
}   