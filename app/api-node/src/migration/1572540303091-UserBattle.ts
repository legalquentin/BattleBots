import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class UserBattle1572540303091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "user_battle",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isGenerated: true,
                    generationStrategy: "increment",
                    isPrimary: true
                },
                {
                    name: "battle_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "user_game_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    isNullable: false,
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);
        
        await queryRunner.createForeignKey("user_battle", new TableForeignKey({
            name: "fk_user_game_user_game_id",
            columnNames: ["user_game_id"],
            referencedTableName: "user_game",
            referencedColumnNames: ["id"]
        }));
        await queryRunner.createForeignKey("user_battle", new TableForeignKey({
            name: "fk_battle_id",
            columnNames: ["battle_id"],
            referencedTableName: "battle",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
