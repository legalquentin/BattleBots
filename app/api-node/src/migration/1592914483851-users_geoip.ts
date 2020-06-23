import {MigrationInterface, QueryRunner, TableForeignKey, Table} from "typeorm";

export class usersGeoip1592914483851 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "users_geoip",
            columns: [
                {
                    name: "user_id",
                    type: "int",
                    isNullable: false,
                    isPrimary: true
                },
                {
                    name: "geoip_id",
                    type: "int",
                    isNullable: false,
                    isPrimary: true
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
        await queryRunner.createForeignKey("users_geoip", new TableForeignKey({
            name: "fk_users_geoip_id",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
        await queryRunner.createForeignKey("users_geoip", new TableForeignKey({
            name: "fk_users_geoip_geoip_id",
            columnNames: ["geoip_id"],
            referencedTableName: "geoip",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("users_geoip", "fk_users_geoip_id");
        await queryRunner.dropForeignKey("users_geoip", "fk_users_geoip_geoip_id");
        await queryRunner.dropTable("users_geoip");
    }

}
