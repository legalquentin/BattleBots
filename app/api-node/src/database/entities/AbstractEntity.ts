import { PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, Column } from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id?: number;

    @Column({ name: 'created_at' })
    public createdAt?: Date;

    @Column({ name: 'updated_at'})
    public updatedAt?: Date;

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