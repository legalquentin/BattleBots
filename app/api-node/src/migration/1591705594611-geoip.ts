import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class geoip1591705594611 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const increment : "increment" | "uuid" | "rowid" = "increment";

        await queryRunner.createTable(new Table({
            name: "geoip",
            columns: [
                {
                    "name": "id",
                    "type": "integer",
                    "isGenerated": true,
                    "isPrimary": true,
                    "generationStrategy": increment,
                },
                {
                    "name": "ip",
                    "type": "varchar",
                    "isUnique": true,
                    "isNullable": false
                },
                {
                    "name": "latitude",
                    "type": "numeric",
                    "isNullable": false
                },
                {
                    "name": "longitude",
                    "type": "numeric",
                    "isNullable": false
                },
                {
                    "name": "country",
                    "type": "varchar",
                    "isNullable": false
                },
                {
                    "name": "city",
                    "type": "varchar",
                    "isNullable": false
                },
                {
                    "name": "timezone",
                    "type": "varchar",
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
                    "default": "CURRENT_TIMESTAMP",
                    "onUpdate": "CURRENT_TIMESTAMP",
                    "isNullable": false
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("geoip");
    }

}
