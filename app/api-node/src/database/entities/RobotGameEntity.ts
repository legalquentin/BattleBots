import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { GameEntity } from "./GameEntity";
import { RobotsEntity } from "./RobotsEntity";

@Entity({
    name: "robots_game"
})
export class RobotGameEntity {
    @PrimaryGeneratedColumn({name: "id"})
    public id: number;

    @JoinColumn({name: "bot_id"})
    @ManyToOne(type => RobotsEntity, robot => robot.robotGame)
    public bot: RobotsEntity;

    @JoinColumn({name: "game_id"})
    @ManyToOne(type => GameEntity, game => game.robots)
    public game: GameEntity;
}