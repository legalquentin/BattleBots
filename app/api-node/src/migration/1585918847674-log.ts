import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class log1585918847674 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "log",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    isGenerated: true,
                    type: "int",
                    generationStrategy: "increment"
                },
                {
                    name: "path",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "method",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "user",
                    type: "integer",
                    isNullable: true
                },
                {
                    name: "body",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "complete",
                    type: "integer",
                    isNullable: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    isNullable: false,
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    isNullable: false,
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                },
            ]
        }));

        await queryRunner.createForeignKey("log", new TableForeignKey({
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user"],
            name: "fk_log_user_id"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("log", "fk_log_user_id");
        await queryRunner.dropTable("log");
    }

}
