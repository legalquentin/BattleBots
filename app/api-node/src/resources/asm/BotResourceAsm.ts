import { RobotsEntity } from "../../database/entities/RobotsEntity";
import { IBotsResource } from "../IBotsResource";
import { Singleton/*, Container */ } from "typescript-ioc";
//import { GameProfileResourceAsm } from "./GameProfileResourceAsm";
import { ArenaEntity } from "../../database/entities/ArenaEntity";
import { RobotsArenaEntity } from "../../database/entities/RobotsArenaEntity";
import { IStreamResource } from "../IStreamResource";
//import { StreamsResourceAsm } from "./StreamsResourceAsm";
//import { UserResourceAsm } from "./UserResourceAsm";
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
    */
   
   // @Inject
    //private streamResourceAsm: StreamsResourceAsm;


    public async toResource(robot: RobotsEntity) {
       // const userResourceAsm = Container.get(UserResourceAsm);
        //const streamResourceAsm = Container.get(StreamsResourceAsm);
        const resource : IBotsResource = {
            id: robot.id,
            address: robot.address,
            baseDamage: robot.damage,
            baseHull: robot.armor,
            taken: robot.taken,
            baseSpeed: robot.speed,
            baseFireRate: robot.fireRate,
            running: robot.running,
            name: robot.name
        };

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
               /*
        if (robot.streams){
            const streams = await robot.streams;
            const resources = [];

            for (let stream of streams){
                resources.push(await streamResourceAsm.toResource(stream));
            }
            resource.streams = resources;
        }
        */
        return (resource);
    }

    public async toResources(robots: Array<RobotsEntity>){
        const resources = [];

        for (let robot of robots){
            resources.push(await this.toResource(robot));
        }   
        return (resources);
    }

    public async addStreamResource(resource: IBotsResource, streams: Array<IStreamResource>){
        resource.streams = streams;
        return (resource);
    }

    public async toEntity(bot: IBotsResource) {
        const robot = new RobotsEntity();
       // const userResourceAsm = Container.get(UserResourceAsm);

        robot.id = bot.id;
        robot.address = bot.address;
        robot.damage = bot.baseDamage;
        robot.armor = bot.baseHull;
        robot.taken = -1; //bot.taken;
        robot.speed = bot.baseSpeed;
        robot.fireRate = bot.baseFireRate;
        robot.running = 1;
        robot.name = bot.name;

        /*
        if (bot.streams){
            const streams = bot.streams;
            const streamEntities = [];

            for (let stream of streams){
                streamEntities.push(await this.streamResourceAsm.toEntity(stream));
            }
            robot.streams = streamEntities;
        }
        */
        /*
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