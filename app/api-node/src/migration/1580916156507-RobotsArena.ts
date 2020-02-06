import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class RobotsArena1580916156507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            "name": "robots_arena",
            "columns": [
                {
                    "name": "id",
                    "type": "int",
                    'isGenerated': true,
                    "isPrimary": true,
                    "generationStrategy": "increment"
                },
                {
                    "name": "bot_id",
                    "type": "int",
                    "isNullable": false
                },
                {
                    "type": "int",
                    "name": "arena_id",
                    "isNullable": false
                }
            ]
        }));

        await queryRunner.createForeignKey("robots_arena", new TableForeignKey({
            name: "fk_robots_arena_bot_id",
            columnNames: ["arena_id"],
            referencedTableName: "arena",
            referencedColumnNames: ["id"]
        }));


        await queryRunner.createForeignKey("robots_arena", new TableForeignKey({
            name: "fk_robots_arena_arena_id_bot",
            columnNames: ["bot_id"],
            referencedTableName: "robots",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
