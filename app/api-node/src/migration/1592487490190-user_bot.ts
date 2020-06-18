import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn} from "typeorm";

export class userBot1592487490190 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "user_bot",
            columns: [
                {
                    name: "user_id",
                    isPrimary: true,
                    type: "int"
                },
                {
                    name: "bot_id",
                    isPrimary: true,
                    type: "int"
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
        await queryRunner.createForeignKey("user_bot", new TableForeignKey({
            name: "fk_user_bot_user_id",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));
        await queryRunner.createForeignKey("user_bot", new TableForeignKey({
            name: "fk_user_bot_bot_id",
            columnNames: ["bot_id"],
            referencedTableName: "robots",
            referencedColumnNames: ["id"]
        }));
        /*
        const botRepository : BotsRepository = queryRunner.manager.getCustomRepository(BotsRepository);
        const botUserRepository : RobotsUserRepository = queryRunner.manager.getCustomRepository(RobotsUserRepository);
        const bots = await botRepository.find();
        for (let bot of bots){
            const user = await bot.user;
            const botUser = new RobotsUserEntity();

            botUser.user = user;
            botUser.robot = bot;
            await botUserRepository.save(botUser);
        }
        */
        await queryRunner.dropForeignKey("robots", "fk_robots_player_id");
        await queryRunner.dropColumn("robots", "player_id");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("robots", new TableColumn({
            name: "player_id",
            type: "int"
        }));
        await queryRunner.createForeignKey("robots", new TableForeignKey({
            name: "fk_robots_player_id",
            columnNames: ["player_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"]
        }));

        /*
        const botUserRepository : RobotsUserRepository = queryRunner.manager.getCustomRepository(RobotsUserRepository);
        const list = await botUserRepository.find();
        const botRepository : BotsRepository = queryRunner.manager.getCustomRepository(BotsRepository);
        for (let item of list){
            const user = item.user;
            const bot = item.robot;

            bot.user = user;
            await botRepository.update(bot.id, bot);
        }
        */
        await queryRunner.dropForeignKey("user_bot", "fk_user_bot_user_id");
        await queryRunner.dropForeignKey("user_bot", "fk_user_bot_bot_id");
        await queryRunner.dropTable("user_bot");
    }

}
