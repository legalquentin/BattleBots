import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class connectedUsers1592912071707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "connected_users",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isGenerated: true,
                    generationStrategy: "increment",
                    isPrimary: true
                },
                {
                    name: "user_id",
                    type: "integer",
                    isNullable: false
                },
                {
                    name: "start_connected",
                    type: "timestamp",
                    isNullable: false
                },
                {
                    name: "end_connected",
                    type: "timestamp",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false
                }
            ]
        }));
        await queryRunner.createForeignKey("connected_users", new TableForeignKey({
            name: "fk_connected_user_id",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("connected_users", "fk_connected_user_id");
        await queryRunner.dropTable("connected_users");
    }

}
