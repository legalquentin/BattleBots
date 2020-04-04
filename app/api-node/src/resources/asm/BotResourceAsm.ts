import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { IBotsResource } from "../IBotsResource";
import { Singleton, Inject } from "typescript-ioc";
import { GameProfileResourceAsm } from "./GameProfileResourceAsm";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";

@Singleton
export class BotResourceAsm {

    @Inject
    private gameProfileResourceAsm: GameProfileResourceAsm;

    public async toResource(robot: RobotsEntity) {
        const resource : IBotsResource = {
            id: robot.id,
            botIp: robot.botIp,
            damage: robot.damage,
            armor: robot.armor,
            taken: robot.taken,
            speed: robot.speed,
            fireRate: robot.fireRate,
            running: robot.running,
            name: robot.name
        };

        if (robot.player){
            resource.gameProfile = await this.gameProfileResourceAsm.toResource(robot.player);
        }
        return (resource);
    }

    public toEntity(bot: IBotsResource) {
        const robot: RobotsEntity = {
            id: bot.id,
            botIp: bot.botIp,
            damage: bot.damage,
            armor: bot.armor,
            taken: bot.taken,
            speed: bot.speed,
            fireRate: bot.fireRate,
            running: bot.running,
            name: bot.name 
        };

        if (bot.gameProfile){
            robot.player = this.gameProfileResourceAsm.toEntity(bot.gameProfile);
        }
        return (robot);
    }

    public async AddArenaEntity(bot: RobotsEntity, arena: ArenaEntity){
        const robotArena : RobotsArenaEntity = {};
    
        robotArena.robot = bot;
        robotArena.arena = arena;
        let r_robotsArena : Array<RobotsArenaEntity> = await bot.robotsArena;

        if (!r_robotsArena){
            r_robotsArena = [];
        }
        r_robotsArena.push(robotArena);
        bot.robotsArena = Promise.resolve(r_robotsArena);
        let a_robotsArena : Array<RobotsArenaEntity> = await arena.robotArena;

        if (!a_robotsArena){
            a_robotsArena = [];
        }
        a_robotsArena.push(robotArena);
        arena.robotArena = Promise.resolve(a_robotsArena);
        return (bot);
    }
}