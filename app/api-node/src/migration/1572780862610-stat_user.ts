import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class statUser1572780862610 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "stat_user",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isUnique: true,
                    generationStrategy: "increment",
                    isGenerated: true
                },
                {
                    name: "dead_number",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "kill_number",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "user_id",
                    type: "int",
                    isNullable: false
                }
            ]
        }));

        await queryRunner.createForeignKey("stat_user", new TableForeignKey({
            name: "fk_stat_user_user_id",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("stat_user", "fk_stat_user_user_id");
        await queryRunner.dropTable("stat_user");
    }

}
