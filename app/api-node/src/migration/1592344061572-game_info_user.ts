import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class gameInfoUser1592344061572 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("game_info", "fk_winner_game_info");
        await queryRunner.dropForeignKey("game_info", "fk_loser_game_info");
        await queryRunner.createForeignKey("game_info", new TableForeignKey({
            name: "fk_user_winner_game_info",
            columnNames: ["winner_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
        await queryRunner.createForeignKey("game_info", new TableForeignKey({
            name: "fk_user_loser_game_info",
            columnNames: ["loser_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("game_info", "fk_user_loser_game_info");
        await queryRunner.dropForeignKey("game_info", "fk_user_winner_game_info");
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

}
