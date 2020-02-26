import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class RobotsGame1580916163727 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            "name": "robots_game",
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
                    "name": "game_id",
                    "isNullable": false
                }
            ]
        }));

        await queryRunner.createForeignKey("robots_game", new TableForeignKey({
            name: "fk_robots_game_bot_game_id",
            columnNames: ["game_id"],
            referencedTableName: "games",
            referencedColumnNames: ["id"]
        }));


        await queryRunner.createForeignKey("robots_game", new TableForeignKey({
            name: "fk_robots_game_game_id_bot",
            columnNames: ["bot_id"],
            referencedTableName: "robots",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("robots_game", "fk_robots_game_bot_game_id");
        await queryRunner.dropForeignKey("robots_game", "fk_robots_game_game_id_bot");
        await queryRunner.dropTable("robots_game");
    }

}
