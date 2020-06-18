import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class userGame1592493112278 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "user_game",
            columns: [
                {
                    name: "user_id",
                    type: "integer",
                    isPrimary: true
                },
                {
                    name: "game_id",
                    type: "integer",
                    isPrimary: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));
        await queryRunner.createForeignKey("user_game", new TableForeignKey({
            name: "fk_user_game_user_id",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
        await queryRunner.createForeignKey("user_game", new TableForeignKey({
            name: "fk_user_game_game_id",
            columnNames: ["game_id"],
            referencedTableName: "games",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("user_game", "fk_user_game_game_id");
        await queryRunner.dropForeignKey("user_game", "fk_user_game_user_id");
        await queryRunner.dropTable("user_game");
    }

}
