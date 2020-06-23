import { Entity, JoinColumn, ManyToOne, Column } from "typeorm";
import UserEntity from "./UserEntity";
import { GameEntity } from "./GameEntity";

@Entity({
    name: "user_game"
})
export class GameUserEntity  {
    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, user => user.gameUsers, {
        eager: true,
        primary: true
    })
    user: UserEntity;

    @JoinColumn({
        name: "game_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => GameEntity, game => game.gameUsers, {
        eager: true,
        primary: true
    })
    game: GameEntity;

    @Column({
        name: "created_at"
    })
    created_at: Date;

    @Column({
        name: "updated_at"
    })
    updated_at: Date;
}
