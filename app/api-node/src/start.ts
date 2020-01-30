'use strict';

import { ApiServer } from './api-server';
import "reflect-metadata";
import { Connection, createConnection, getRepository } from 'typeorm';

import UserEntity from './database/entities/UserEntity';

// import { MongoConnector } from "./mongo-connector";


export async function start(): Promise<void> {
    // const mongoConnector = new MongoConnector();
    console.log("test")
    // TODO : Create config files (db settings and entities declarations)
    createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "root",
        password: "p@ssw0rd",
        database: "db",
        entities: [
            UserEntity
        ],
        synchronize: true,
        logging: false
    }).then(async (connection: Connection) => {
        console.log("Connexion établie")

        // Create a new table entry using classic class creation
        // The constructor can also be used for this
        const user: UserEntity = new UserEntity();
        user.firstname = 'Lucas';
        user.lastname = 'Pointurier';
        user.hash = 'toto';
        user.salt = 'tata';
        getRepository(UserEntity).save(user).then(() => {
            console.log("User created !");
        });
        
        // Create new table entry using clasic JSON
        // Here we just create a sample json, then we pass it as object to
        // type##Repository create method that return UserEntity | UserEntity[]
        const jsonUser: string = JSON.stringify({
            firstname: 'Lucas2',
            lastname: 'Pointurier2',
            hash: 'test',
            salt: 'testo',
        }, null, 4);
        
        const secondUserEntity: UserEntity | UserEntity[] = getRepository(UserEntity).create(JSON.parse(jsonUser));
        getRepository(UserEntity).save(secondUserEntity);
        // So while we receive ISO json, we can insert it in db with two lines of code !

        const apiServer = new ApiServer();
        await apiServer.start();
        // await mongoConnector.connect();
        const graceful = async () => {
            // await mongoConnector.disconnect();
            await apiServer.stop();
            process.exit(0);
        };

        // Stop graceful
        process.on('SIGTERM', graceful);
        process.on('SIGINT', graceful);
    }).catch((error: Error) => console.log(error));
}
