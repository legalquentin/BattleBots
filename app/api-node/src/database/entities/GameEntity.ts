import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ArenaEntity } from "./ArenaEntity";
import { RobotGameEntity } from "./RobotGameEntity";
import { StreamsEntity } from "./StreamsEntity";
import { IsString, IsInt } from "class-validator";

@Entity({
    name: "games"
})
export class GameEntity extends AbstractEntity {
    @Column({ name: "game_name", nullable: false })
    @IsString()
    public game_name: string;

    @JoinColumn({
        name: "arena_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => ArenaEntity, arena => arena.games)
    public arena: ArenaEntity;

    @Column({ name: "game_status", nullable: false })
    @IsInt()
    public game_status: number;

    @OneToMany(type => RobotGameEntity, robotGame => robotGame.game)
    public robots: Array<RobotGameEntity>;

    @OneToMany(type => StreamsEntity, streams => streams.game)
    public streams: Array<StreamsEntity>;
}
