import { PlayerService } from "../PlayerService";
import { PlayerEntity } from "../../database/entities/PlayerEntity";
import { Inject, Singleton } from "typescript-ioc";
import IServiceFactory from "../IServiceFactory";

@Singleton
export class PlayerServiceImpl implements PlayerService {

    @Inject
    private factory : IServiceFactory;

    public async saveOrUpdate(player: PlayerEntity): Promise<PlayerEntity> {
        try {
            if (player.id){
                await this.factory.getPlayerRepository().update(player.id, player);
                return (player);
            }
            else {
                await this.factory.getPlayerRepository().save(player);
                return (player);
            }
        }
        catch (e){
            throw e;
        }
    }

    public async deleteOne(id: number) : Promise<Boolean> {
        try {
            const player = await this.factory.getPlayerRepository().findOne(id);

            if (player){
                await this.factory.getPlayerRepository().delete(player.id);

                return (true);
            }
            return (false);
        }
        catch (e){
            return (false);
        }
    }

    public findOne(id: number) : Promise<PlayerEntity> {
        return (this.factory.getPlayerRepository().findOne(id));
    }

    public findAll(): Promise<Array<PlayerEntity>>{
        return (this.factory.getPlayerRepository().find());
    }

    public search(options: any): Promise<PlayerEntity[]> {
        return (this.factory.getPlayerRepository().find(options));
    }

    public async playerExist(id: number){
        return (await this.factory.getPlayerRepository().findOne(id) != null);
    }
}
