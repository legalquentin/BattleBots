import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { GameEntity } from "./GameEntity";
import { RobotsEntity } from "./RobotsEntity";

@Entity({
    name: "robots_game"
})
export class RobotGameEntity {
    @JoinColumn({name: "bot_id"})
    @ManyToOne(type => RobotsEntity, robot => robot.robotGame, {
        eager: true,
        cascade: ["insert", "update"],
        primary: true
    })
    public bot: RobotsEntity;

    @JoinColumn({name: "game_id"})
    @ManyToOne(type => GameEntity, game => game.robots, {
        eager: true,
        cascade: ["insert", "update"],
        primary: true
    })
    public game: GameEntity;
}