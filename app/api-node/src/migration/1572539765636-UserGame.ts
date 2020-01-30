import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class UserGame1572539765636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            "name": "user_game",
            "columns": [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "user_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "resistance",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "identifier",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "health",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "lives",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "max_lives",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "damage",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "level",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "experience",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    isNullable: false,
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    isNullable: false,
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));
        await queryRunner.createForeignKey("user_game", new TableForeignKey({
            name: "fk_user_game_user_id",
            columnNames: ["user_id"],
            referencedTableName: "user",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
