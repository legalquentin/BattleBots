import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class player1582536574248 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "player",
            columns: [
                {
                    "name": "id",
                    "type": "int",
                    "isGenerated": true,
                    "isPrimary": true,
                    "generationStrategy": "increment"
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "isNullable": false,
                    "isUnique": true
                },
                {
                    "name": "user_id",
                    "type": "int",
                    "isNullable": false
                },
                {
                    "name": "total_points",
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
        await queryRunner.createForeignKey("player", new TableForeignKey({
            name: "fk_player_user_id",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("player", "fk_player_user_id");
        await queryRunner.dropTable("player");
    }

}
