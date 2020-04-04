import { BotsService } from "../BotsService";
import { RobotsEntity } from "../../database/entities/RobotsEntity";
import IServiceFactory from "../IServiceFactory";
import { Inject, Singleton } from "typescript-ioc";

@Singleton
export class BotsServiceImpl implements BotsService {
    @Inject
    private service: IServiceFactory;

    public async saveOrUpdate(bots: RobotsEntity): Promise<RobotsEntity>
    {
            try {
                if (bots.id)
                {
                    const finded = await this.service.getBotsRepository().findOne(bots.id);

                    finded.armor = bots.armor;
                    finded.botIp = bots.botIp;
                    finded.damage = bots.damage;
                    finded.fireRate = bots.fireRate;
                    finded.name = bots.name;
                    finded.running = bots.running;
                    finded.speed = bots.speed;
                    finded.taken = bots.taken;
                    if (bots.player)
                    {
                        finded.player = bots.player;
                    }
                    if (bots.robotsArena)
                    {
                        finded.robotsArena = bots.robotsArena;
                    }
                    if (bots.robotGame)
                    {
                        finded.robotGame = bots.robotGame;
                    }
                    if (bots.streams)
                    {
                        finded.streams = bots.streams;
                    }
                    await this.service.getBotsRepository().update(finded.id, finded);
    
                    return (finded);
                }
                else {
                    const saved = this.service.getBotsRepository().save(bots);

                    return (saved);
                }

            }
            catch (e)
            {
                throw e;
            }
    }

    public async findOne(id: number): Promise<RobotsEntity>
    {
        return (this.service.getBotsRepository().findOne(id));
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
                await this.service.getBotsRepository().delete(bots.id);
                return (true);
            }
            else
            {
                return (false);
            }
        }
        catch (e)
        {
            return (false);
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