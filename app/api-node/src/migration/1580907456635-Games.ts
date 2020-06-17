import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Games1580907456635 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const increment: 'increment' | 'uuid' | 'rowid' = "increment";

        await queryRunner.createTable(new Table({
            name: "games",
            columns: [
                {
                    type: "int",
                    isGenerated: true,
                    generationStrategy: increment,
                    name: "id",
                    isPrimary: true
                },
                {
                    name: "game_name",
                    isNullable: false,
                    type: "varchar"
                },
                {
                    type: "int",
                    name: "arena_id",
                    isNullable: true
                },
                {
                    type: "varchar",
                    name: "game_status",
                    isNullable: false
                },
                {
                    type: "timestamp",
                    name: "created_at",
                    isNullable: true
                },
                {
                    type: "timestamp",
                    name: "started_at",
                    isNullable: true
                },
                {
                    type: "timestamp",
                    name: "ended_at",
                    isNullable: true
                }
            ]
        }))

        await queryRunner.createForeignKey("games", new TableForeignKey({
            name: "fk_games_arena_id",
            columnNames: ["arena_id"],
            referencedTableName: "arena",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("games", "fk_games_arena_id");
        await queryRunner.dropTable("games");
    }

}
