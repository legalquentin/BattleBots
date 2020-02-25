import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class playerGame1582536583852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "player_game",
            columns: [
                {
                    "name": "player_id",
                    "type": "int",
                    "isNullable": false
                },
                {
                    "name": "game_id",
                    "type": "int",
                    "isNullable": false
                },
                {
                    "name": "winner",
                    "type": "int",
                    "isNullable": false
                },
                {
                    "name": "game_points",
                    "type": "int",
                    "isNullable": false
                },
                {
                    "name": "created_at",
                    "type": "timestamp",
                    "default": "CURRENT_TIMESTAMP",
                    "isNullable": false
                },
                {
                    "name": "updated_at",
                    "type": "timestamp",
                    "onUpdate": "CURRENT_TIMESTAMP",
                    "default": "CURRENT_TIMESTAMP",
                    "isNullable": false
                }
            ]
        }));
        await queryRunner.createForeignKey("player_game", new TableForeignKey({
            name: "fk_player_game_player_id",
            columnNames: ["player_id"],
            referencedTableName: "player",
            referencedColumnNames: ["id"]
        }));
        await queryRunner.createForeignKey("player_game", new TableForeignKey({
            name: "fk_player_game_game_id",
            columnNames: ["game_id"],
            referencedTableName: "games",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("player_game", "fk_player_game_player_id");
        await queryRunner.dropForeignKey("player_game", "fk_player_game_game_id");
        await queryRunner.dropTable("player_game");
    }

}
