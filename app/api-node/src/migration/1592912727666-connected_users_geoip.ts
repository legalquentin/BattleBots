import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class connectedUsersGeoip1592912727666 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "connected_users_geoip",
            columns: [
                {
                    name: "connected_user_id",
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
        await queryRunner.createForeignKey("connected_users_geoip", new TableForeignKey({
            name: "fk_connected_users_geoip_id",
            columnNames: ["connected_user_id"],
            referencedTableName: "connected_users",
            referencedColumnNames: ["id"]
        }));
        await queryRunner.createForeignKey("connected_users_geoip", new TableForeignKey({
            name: "fk_connected_users_geoip_geoip_id",
            columnNames: ["geoip_id"],
            referencedTableName: "geoip",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("connected_users_geoip", "fk_connected_users_geoip_id");
        await queryRunner.dropForeignKey("connected_users_geoip", "fk_connected_users_geoip_geoip_id");
        await queryRunner.dropTable("connected_users_geoip");
    }

}
