import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class robotUser1592344631785 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("robots", "fk_robots_player_id");
        await queryRunner.createForeignKey("robots", new TableForeignKey({
            name: "fk_robots_user_id",
            columnNames: ["player_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("robots", "fk_robots_user_id")
        await queryRunner.createForeignKey("robots", new TableForeignKey({
            name: "fk_robots_player_id",
            columnNames: ["player_id"],
            referencedTableName: "player",
            referencedColumnNames: ["id"]
        }));
    }

}
