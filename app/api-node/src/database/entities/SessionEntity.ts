import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, getManager } from "typeorm";
import UserEntity from "./UserEntity";
import { RobotsEntity } from "./RobotsEntity";
import { StreamsEntity } from "./StreamsEntity";
import { GameEntity } from "./GameEntity";

@Entity({
    name: "session"
})
export class SessionEntity {

    @PrimaryGeneratedColumn({
        name: "id"
    })
    id: number;

    @JoinColumn({
        name: "player_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, user => user.sessions)
    player: UserEntity;

    @JoinColumn({
        name: "bot_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => RobotsEntity, robot => robot.sessions)
    bot: RobotsEntity;

    @JoinColumn({
        name: "stream_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => StreamsEntity, stream => stream.sessions)
    stream: StreamsEntity;

    @JoinColumn({
        name: "game_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => GameEntity, game => game.sessions)
    game: GameEntity;

    @Column({
        name: "bot_energy"
    })
    botEnergy: number;

    @Column({
        name: "bot_heat"
    })
    botHeat: number;
}