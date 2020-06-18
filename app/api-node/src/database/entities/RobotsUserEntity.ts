import UserEntity from "./UserEntity";
import { RobotsEntity } from "./RobotsEntity";
import { Entity, JoinColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity({
    name: "user_bot"
})
export class RobotsUserEntity {

    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id",
    })
    @ManyToOne(type => UserEntity, user => user.robotsUser, {
        primary: true
    })
    user: UserEntity;
    
    @JoinColumn({
        name: "bot_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => RobotsEntity, robot => robot.robotsUser, {
        primary: true
    })
    robot: RobotsEntity;
    
    @Column({
        name: "created_at"
    })
    createdAt: Date;
    
    @Column({
        name: "updated_at"
    })
    updatedAt: Date;

    @BeforeInsert()
    public upCreatedAt(){
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    @BeforeUpdate()
    public upUpdatedAt(){
        this.updatedAt = new Date();
    }
}