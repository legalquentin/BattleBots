import { Entity, Column } from "typeorm";

@Entity({
    name: "robots_game"
})
export class RobotGameEntity {
    @Column({name: "id"})
    id: number;

    @Column({name: "bot_id"})
    botId: number;

    @Column({name: "game_id"})
    gameId: number;
}