import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class gameInfo1591709632400 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "game_info",
            columns:[
                {
                    "name": "id",
                    "type": "integer",
                    "isPrimary": true,
                    "isGenerated": true,
                    "generationStrategy": "increment"
                },
                {
                    "name": "winner_id",
                    "type": "integer",
                    "isNullable": false
                },
                {
                    "name": "loser_id",
                    "type": "integer",
                    "isNullable": false
                },
                {
                    "name": "game_id",
                    "type": "integer",
                    "isNullable": false
                },
                {
                    "name": "winnerpoints",
                    "type": "integer",
                    "isNullable": false
                },
                {
                    "name": "video_winner",
                    "type": "varchar",
                    "isNullable": false
                },
                {
                    "name": "video_loser",
                    "type": "varchar",
                    "isNullable": false
                },
                {
                    "name": "loserpoints",
                    "type": "integer",
                    "isNullable": false
                },
                {
                    "name": "created_at",
                    "type": "timestamp",
                    "default": "CURRENT_TIMESTAMP"
                },
                {
                    "name": "updated_at",
                    "type": "timestamp",
                    "default": "CURRENT_TIMESTAMP",
                    "onUpdate": "CURRENT_TIMESTAMP"
                }
            ]
        }));

        await queryRunner.createForeignKey("game_info", new TableForeignKey({
            "name": "fk_game_info_game",
            "columnNames": ["game_id"],
            "referencedTableName": "games",
            "referencedColumnNames": ["id"]
        }));

        await queryRunner.createForeignKey("game_info", new TableForeignKey({
            name: "fk_winner_game_info",
            columnNames: ["winner_id"],
            referencedTableName: "player",
            referencedColumnNames: ["id"]
        }));

        await queryRunner.createForeignKey("game_info", new TableForeignKey({
            name: "fk_loser_game_info",
            columnNames: ["loser_id"],
            referencedTableName: "player",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("game_info", "fk_game_info_game");
        await queryRunner.dropForeignKey("game_info", "fk_winner_game_info");
        await queryRunner.dropForeignKey("game_info", "fk_loser_game_info");
        await queryRunner.dropTable("game_info");
    }

}
