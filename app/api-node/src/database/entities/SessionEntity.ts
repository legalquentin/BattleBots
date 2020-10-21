import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne } from "typeorm";
import UserEntity from "./UserEntity";
import { RobotsEntity } from "./RobotsEntity";
import { StreamsEntity } from "./StreamsEntity";
import { GameEntity } from "./GameEntity";
import { ConnectedUserEntity } from "./ConnectedUserEntity";

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
    @ManyToOne(type => UserEntity, user => user.sessions, {
        eager: true
    })
    player: UserEntity;

    @JoinColumn({
        name: "bot_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => RobotsEntity, robot => robot.sessions, {
        eager: true
    })
    bot: RobotsEntity;

    @JoinColumn({
        name: "stream_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => StreamsEntity, stream => stream.sessions, {
        eager: true
    })
    stream: StreamsEntity;

    @JoinColumn({
        name: "connected_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => ConnectedUserEntity, conn => conn.sessions, {
        eager: true
    })
    connected: ConnectedUserEntity;

    @JoinColumn({
        name: "game_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => GameEntity, game => game.sessions, {
        eager: true
    })
    game: GameEntity;

    @Column({
        name: "bot_energy"
    })
    botEnergy: number;

    @Column({
        name: "bot_heat"
    })
    botHeat: number;

    @Column({
        name: "bot_health"
    })
    botHealth: number;
}