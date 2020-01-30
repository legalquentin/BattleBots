import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1572537760733 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"    
                },
                {
                    name: "pseudo",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "email",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "firstname",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "lastname",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "address",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "hash",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "salt",
                    type: "varchar",
                    isNullable: false
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
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
