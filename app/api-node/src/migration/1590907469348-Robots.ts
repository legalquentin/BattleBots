import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Robots1590907469348 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "robots",
            columns: [
                {
                    name: "id",
                    type: "int",
                    generationStrategy: "increment",
                    isPrimary: true,
                    isGenerated: true
                },
                {
                    name: "bot_ip",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "running",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "taken",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "speed",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "damage",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "fire_rate",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "armor",
                    type: "int",
                    isNullable: false
                },
                {
                    type: "timestamp",
                    name: "created_at",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false
                },
                {
                    type: "timestamp",
                    name: "updated_at",
                    onUpdate: "CURRENT_TIMESTAMP",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("robots");
    }

}
