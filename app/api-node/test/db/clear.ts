import UserEntity from "../../src/database/entities/UserEntity";
import { PlayerEntity } from "../../src/database/entities/PlayerEntity";
import { createConnection, Connection } from "typeorm";

export async function clear() {
    createConnection({
        name: "test",
        type: "postgres",
        host: "localhost",
        port: process.env.NODE_ENV === "test" ? 5434 : 5432,
        username: "root",
        password: "p@ssw0rd",
        database: process.env.NODE_ENV === "test" ? "db_test" : "db",
        entities: [
            `${__dirname}/../../src/database/entities/**/*.ts`
        ],
        synchronize: true,
        logging: process.env.NODE_ENV !== "test"
    }).then((connection: Connection) => {
        const playerEntity = connection.getRepository(PlayerEntity);
        const userEntity = connection.getRepository(UserEntity);

        playerEntity.clear();
        userEntity.clear();
        connection.close();
    });
};
