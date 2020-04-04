import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ArenaEntity } from "./ArenaEntity";
import { RobotGameEntity } from "./RobotGameEntity";
import { StreamsEntity } from "./StreamsEntity";
import { IsString, IsInt } from "class-validator";
import { EGameStatus } from "../../resources/EGameStatus";

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
    @ManyToOne(type => ArenaEntity, arena => arena.games, {
        eager: true,
        nullable: true,
        cascade: ["insert", "update"]
    })
    public arena?: ArenaEntity;

    @Column({ name: "game_status", nullable: false })
    @IsInt()
    public game_status: EGameStatus;

    @OneToMany(type => RobotGameEntity, robotGame => robotGame.game, {
        cascade: ["insert", "update", "remove"]
    })
    public robots?: Promise<Array<RobotGameEntity>>;

    @OneToMany(type => StreamsEntity, streams => streams.game, {
        cascade: ["insert", "update", "remove"]
    })
    public streams?: Promise<Array<StreamsEntity>>;
}
