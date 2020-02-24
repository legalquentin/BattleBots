import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "robots_game"
})
export class RobotGameEntity {
    @PrimaryGeneratedColumn({name: "id"})
    public id: number;

    @Column({name: "bot_id"})
    public botId: number;

    @Column({name: "game_id"})
    public gameId: number;
}