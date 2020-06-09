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
                    "isNullable": false
                },
                {
                    "name": "log_id",
                    "type": "integer",
                    "isNullable": true
                },
                {
                    "name": "lagitude",
                    "type": "integer",
                    "isNullable": false
                },
                {
                    "name": "lontitude",
                    "type": "integer",
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

        await queryRunner.createForeignKey("geoip", new TableForeignKey({
            name: "fk_geoip_log",
            columnNames: ["log_id"],
            referencedTableName: "log",
            referencedColumnNames: ["id"]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("geoip", "fk_geoip_log");
        await queryRunner.dropTable("geoip");
    }

}
