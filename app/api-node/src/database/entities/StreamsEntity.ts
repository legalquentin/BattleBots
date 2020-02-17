import { AbstractEntity } from "./AbstractEntity";
import { Column } from "typeorm";

export class StreamsEntity extends AbstractEntity {
    @Column({name: "game_id"})
    gameId: number;

    @Column({name: "robot_id"})
    robotId: number;

    @Column({name: "kinesis_url"})
    kinesisUrl: string;

    @Column({name: "s3_url"})
    s3Url: string;

    @Column({name: "private"})
    private: number;

    @Column({name: "running"})
    running: number;

    @Column({name: "duration"})
    duration: number;

    @Column({name: "encodage"})
    encodage: string;
}
