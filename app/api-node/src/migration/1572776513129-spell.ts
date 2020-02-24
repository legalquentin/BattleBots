import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class spell1572776513129 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.createTable(new Table({
            name: "spell",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "formula",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    isNullable: false,
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    isNullable: false,
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("spell");
    }

}
