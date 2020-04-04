import UserEntity from "./UserEntity";
import { AbstractEntity } from "./AbstractEntity";
import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";
import { IsString, IsInt } from "class-validator";

@Entity({
    name: "log"
})
export class LogEntity extends AbstractEntity{

    @IsString()
    @Column({name: "path"})
    public path?: string;

    @IsString()
    @Column({name: "method"})
    public method?: string;

    @IsInt()
    @Column({name: "complete"})
    public complete?: number;

    @IsString()
    @Column({name: "body"})
    public body?: string;

    @Column({name: 'start_time'})
    public startTime?: Date;

    @Column({name: 'end_time'})
    public endTime?: Date;

    @Column({name: 'duration'})
    public duration?: Date;

    @Column({name: 'response_code'})
    public responseCode?: number;

    @JoinColumn({
        name: "user",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, user => user.logs, {
        eager: true,
        nullable: true
    })
    public user?: UserEntity;

}