import { AbstractEntity } from "./AbstractEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { GameEntity } from "./GameEntity";
import { RobotsEntity } from "./RobotsEntity";
import { SessionEntity } from "./SessionEntity";

@Entity({
    name: "streams"
})
export class StreamsEntity extends AbstractEntity {

    @ManyToOne(type => GameEntity, game => game.streams, {
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "game_id"})
    public game: GameEntity;

    @ManyToOne(type => RobotsEntity, bot => bot.streams, {
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "robot_id"})
    public robot: RobotsEntity;

    @Column({name: "kinesis_url"})
    public kinesisUrl: string;

    @Column({name: "s3_url"})
    public s3Url: string;

    @Column({name: "private"})
    public private: number;

    @Column({name: "running"})
    public running: number;

    @Column({name: "duration"})
    public duration: number;

    @Column({name: "encodage"})
    public encodage: string;

    @OneToMany(type => SessionEntity, session => session.stream, {
        lazy: true
    })
    public sessions?: Array<SessionEntity>;
}
