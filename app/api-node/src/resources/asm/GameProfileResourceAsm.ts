import { PlayerEntity } from "../../database/entities/PlayerEntity";
import IGameProfileResource  from "../../resources/IGameProfileResource";
import {  Singleton, Container } from "typescript-ioc";
import { UserGameProfileResourceAsm } from "./UserGameProfileResourceAsm";

@Singleton
export class GameProfileResourceAsm {

    private userGameProfileResourceAsm: UserGameProfileResourceAsm;

    constructor(){
        this.userGameProfileResourceAsm = Container.get(UserGameProfileResourceAsm);
    }

    /*
    public toEntity(resource: IGameProfileResource){
        return this.userGameProfileResourceAsm.toPlayerEntity(resource);
    }

    public async toResource(player: PlayerEntity){
        return this.userGameProfileResourceAsm.toPlayerResource(player);
    }
    

    public async toResources(players: Array<PlayerEntity>){
        const resources = (async (players) => {
            let resources = [];

            for (let player of players){
                resources.push(await this.toResource(player));
            }
            return (resources);
        })(players);

        return (resources);
    }
    */
}