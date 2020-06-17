import { Entity, Column, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArenaEntity } from "./ArenaEntity";
import { RobotGameEntity } from "./RobotGameEntity";
import { StreamsEntity } from "./StreamsEntity";
import { EGameStatus } from "../../resources/EGameStatus";
import { GameInfoEntity } from "./GameInfoEntity";

@Entity({
    name: "games"
})
export class GameEntity  {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id?: number;

    @Column({name: "created_at"})
    public created_at: Date;

    @Column({name: "started_at"})
    public started_at: Date;

    @Column({name: "ended_at"})
    public ended_at: Date;

    @Column({ name: "game_name", nullable: false })
    public game_name: string;

    @JoinColumn({
        name: "arena_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => ArenaEntity, arena => arena.games, {
        eager: true,
        nullable: true})
    public arena?: ArenaEntity;

    @Column({ name: "game_status", nullable: false })
    public game_status: EGameStatus;

    @OneToMany(type => RobotGameEntity, robotGame => robotGame.game, {
        lazy: true,
    })
    public robots?: Array<RobotGameEntity>;

    @OneToMany(type => StreamsEntity, streams => streams.game, {
        lazy: true
    })
    public streams?: Array<StreamsEntity>;

    @OneToOne(type => GameInfoEntity, gameInfoEntity => gameInfoEntity.game)
    public info: GameInfoEntity

}
