import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id?: number;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    public updatedAt?: Date;
}