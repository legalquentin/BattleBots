import { AbstractEntity } from "./AbstractEntity";
import { Entity, ManyToOne, JoinColumn, Column, OneToOne } from "typeorm";
import { PlayerEntity } from "./PlayerEntity";
import { GameEntity } from "./GameEntity";

@Entity({
    name: "game_info"
})
export class GameInfoEntity extends AbstractEntity{
    @JoinColumn({
        name: "winner_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => PlayerEntity, playerEntity => playerEntity.infoWinner)
    winner: PlayerEntity;

    @JoinColumn({
        name: "loser_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => PlayerEntity, player => player.infoLoser)
    loser: PlayerEntity;

    @Column({
        name: "winnerpoints"
    })
    winnerpoints: number;
    
    @Column({
        name: "loserpoints"
    })
    loserpoints: number;

    @Column({
        name: "gamestarted_at"
    })
    gamestarted_at: Date;
    
    @Column({
        name: "gameended_at"
    })
    gameended_at: Date;

    @Column({
        name: "video_winner"
    })
    video_winner: string;

    @Column({
        name: "video_loser"
    })
    video_loser: string;

    @JoinColumn({
        name: "game_id",
        referencedColumnName: "id"
    })
    @OneToOne(type => GameEntity, game => game.info)
    game: GameEntity;
}
