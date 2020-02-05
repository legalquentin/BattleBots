import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Streams1580913294302 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "streams",
            columns: [
                {
                    "name": "id",
                    "isPrimary": true,
                    "isGenerated": true,
                    "generationStrategy": "increment",
                    "type": "int"
                },
                {
                    "name": "game_id",
                    "isNullable": false,
                    "type": "int"
                },
                {
                    "name": "robot_id",
                    "isNullable": false,
                    "type": "int"
                },
                {
                    "name": "kinesis_url",
                    "isNullable": false,
                    "type": "varchar",
                },
                {
                    "name": "s3_url",
                    "isNullable": false,
                    "type": "varchar"
                },
                {
                    "name": "private",
                    "isNullable": false,
                    "type": "int"
                },
                {
                    "name": "running",
                    "isNullable": false,
                    "type": "int"
                },
                {
                    "name": "duration",
                    "isNullable": false,
                    "type": "int"
                },
                {
                    "name": "encodage",
                    "isNullable": false,
                    "type": "varchar"
                },
                {
                    "name": "created_at",
                    "isNullable": false,
                    "type": "timestamp",
                    "default": "CURRENT_TIMESTAMP"
                },
                {
                    "name": "updated_at",
                    "isNullable": false,
                    "type": "timestamp",
                    "onUpdate": "CURRENT_TIMESTAMP"
                }
            ]
        }));

        await queryRunner.createForeignKey("streams", new TableForeignKey({
            name: "fk_streams_game_id",
            columnNames: ["game_id"],
            referencedTableName: "games",
            referencedColumnNames: ["id"]
        }));

        await queryRunner.createForeignKey("streams", new TableForeignKey({
            name: "fk_streams_robot_id",
            columnNames: ["robot_id"],
            referencedTableName: "robots",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
