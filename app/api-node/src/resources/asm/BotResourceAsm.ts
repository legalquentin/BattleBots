import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { IBotsResource } from "../IBotsResource";

export class BotResourceAsm {
    public toResource(robot: RobotsEntity) {
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

        return (robot);
    }
}