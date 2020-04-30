import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { IBotsResource } from "../IBotsResource";
import { Singleton, Container } from "typescript-ioc";
//import { GameProfileResourceAsm } from "./GameProfileResourceAsm";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import { GameProfileResourceAsm } from "./GameProfileResourceAsm";
import { StreamsResourceAsm } from "./StreamsResourceAsm";
/*
import { GameResourceAsm } from "./GameResourceAsm";
import { StreamsResourceAsm } from "./StreamsResourceAsm";
import { RobotGameEntity } from "../../database/entities/RobotGameEntity";
*/

@Singleton
export class BotResourceAsm {
    /*
    @Inject
    private gameProfileResourceAsm: GameProfileResourceAsm;

    @Inject
    private gameResourceAsm: GameResourceAsm;

    @Inject
    private streamResourceAsm: StreamsResourceAsm;
    */

    public async toResource(robot: RobotsEntity) {
        const gameProfileResourceAsm = Container.get(GameProfileResourceAsm);
        const streamResourceAsm = Container.get(StreamsResourceAsm);
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
            resource.gameProfile = await gameProfileResourceAsm.toResource(robot.player);
        }
        /*
        if (robot.robotGame){
            const botGames = await robot.robotGame;
            const gameResources = [];

            for (let botGame of botGames){
                const game = await this.gameResourceAsm.toResource(botGame.game);

                gameResources.push(game);
            }
            resource.games = gameResources;
        }
                */
        if (robot.streams){
            const streams = await robot.streams;
            const resources = [];

            for (let stream of streams){
                resources.push(await streamResourceAsm.toResource(stream));
            }
            resource.streams = resources;
        }
        return (resource);
    }

    public async toResources(robots: Array<RobotsEntity>){
        const resources = [];

        for (let robot of robots){
            resources.push(await this.toResource(robot));
        }   
        return (resources);
    }

    public async toEntity(bot: IBotsResource) {
        const robot = new RobotsEntity();
        const gameProfileResourceAsm = Container.get(GameProfileResourceAsm);

        robot.id = bot.id;
        robot.botIp = bot.botIp;
        robot.damage = bot.damage;
        robot.armor = bot.armor;
        robot.taken = bot.taken;
        robot.speed = bot.speed;
        robot.fireRate = bot.fireRate;
        robot.running = bot.running;
        robot.name = bot.name;
        if (bot.gameProfile){
            robot.player = gameProfileResourceAsm.toEntity(bot.gameProfile);
        }
        /*
        if (bot.streams){
            const streams = bot.streams;
            const streamEntities = [];

            for (let stream of streams){
                streamEntities.push(await this.streamResourceAsm.toEntity(stream));
            }
            robot.streams = Promise.resolve(streamEntities);
        }
        if (bot.games){
            const games = bot.games;
            const gameEntities = [];

            for (let game of games){
                const botGame: RobotGameEntity = {};

                botGame.game = await this.gameResourceAsm.toEntity(game);
                botGame.bot = robot;
                gameEntities.push(botGame);
            }
            robot.robotGame = Promise.resolve(gameEntities);
        }
        */
        return (robot);
    }

    public async AddArenaEntity(bot: RobotsEntity, arena: ArenaEntity){
        const robotArena : RobotsArenaEntity = {};
    
        robotArena.robot = bot;
        robotArena.arena = arena;
        let r_robotsArena : Array<RobotsArenaEntity> = bot.robotsArena;

        if (!r_robotsArena){
            r_robotsArena = [];
        }
        r_robotsArena.push(robotArena);
        bot.robotsArena = r_robotsArena;
        let a_robotsArena : Array<RobotsArenaEntity> = arena.robotArena;

        if (!a_robotsArena){
            a_robotsArena = [];
        }
        a_robotsArena.push(robotArena);
        arena.robotArena = a_robotsArena;
        return (bot);
    }
}