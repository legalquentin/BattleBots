import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Arena1580907447839 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "arena",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "arena_name",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "available",
                    type: "int",
                    isNullable: false,
                },
                {
                    type: "timestamp",
                    name: "created_at",
                    default: "CURRENT_TIMESTAMP",
                    isNullable: false
                },
                {
                    type: "timestamp",
                    name: "updated_at",
                    onUpdate: "CURRENT_TIMESTAMP",
                    isNullable: false
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("arena");
    }

}
