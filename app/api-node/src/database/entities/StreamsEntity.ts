import { AbstractEntity } from "./AbstractEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { GameEntity } from "./GameEntity";
import { RobotsEntity } from "./RobotsEntity";
import { IsString, IsInt } from "class-validator";

@Entity({
    name: "streams"
})
export class StreamsEntity extends AbstractEntity {
    @ManyToOne(type => GameEntity, game => game.streams)
    @JoinColumn({name: "game_id"})
    public game: GameEntity;

    @ManyToOne(type => RobotsEntity, bot => bot.streams)
    @JoinColumn({name: "robot_id"})
    public robot: RobotsEntity;

    @Column({name: "kinesis_url"})
    @IsString()
    public kinesisUrl: string;

    @Column({name: "s3_url"})
    @IsString()
    public s3Url: string;

    @Column({name: "private"})
    @IsInt()
    public private: number;

    @Column({name: "running"})
    @IsInt()
    public running: number;

    @Column({name: "duration"})
    @IsInt()
    public duration: number;

    @Column({name: "encodage"})
    @IsString()
    public encodage: string;
}
