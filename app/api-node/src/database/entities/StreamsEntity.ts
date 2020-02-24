import { AbstractEntity } from "./AbstractEntity";
import { Column, Entity } from "typeorm";

@Entity({
    name: "streams"
})
export class StreamsEntity extends AbstractEntity {
    @Column({name: "game_id"})
    public gameId: number;

    @Column({name: "robot_id"})
    public robotId: number;

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
}
