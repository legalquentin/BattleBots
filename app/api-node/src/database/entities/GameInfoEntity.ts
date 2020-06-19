import { AbstractEntity } from "./AbstractEntity";
import { Entity, ManyToOne, JoinColumn, Column, OneToOne } from "typeorm";
import { GameEntity } from "./GameEntity";
import UserEntity from "./UserEntity";

@Entity({
    name: "game_info"
})
export class GameInfoEntity extends AbstractEntity{
    @JoinColumn({
        name: "winner_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, userEntity => userEntity.infoWinner)
    winner: UserEntity;

    @JoinColumn({
        name: "loser_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, userEntity => userEntity.infoLoser)
    loser: UserEntity;

    @Column({
        name: "winnerpoints"
    })
    winnerpoints: number;
    
    @Column({
        name: "loserpoints"
    })
    loserpoints: number;

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
    @OneToOne(type => GameEntity, game => game.info, {
        onDelete: 'CASCADE'
    })
    game: GameEntity;
}
