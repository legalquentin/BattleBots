'use strict';
import { ApiServer } from './api-server';
import "reflect-metadata";
import { Connection, createConnection, getRepository } from 'typeorm';
import { SpellEntity } from './database/entities/SpellEntity';
import * as fs from "fs";
//import UserEntity from './database/entities/UserEntity';

// import { MongoConnector } from "./mongo-connector";


export async function start(): Promise<ApiServer> {

    // const mongoConnector = new MongoConnector();
    // TODO : Create config files (db settings and entities declarations)
    return new Promise((resolve, reject) => {
        console.dir(process.env.NODE_ENV);
        fs.appendFileSync('./log.txt', process.env.NODE_ENV + "\n");
        createConnection({
            type: "postgres",
            host: "localhost",
            port: process.env.NODE_ENV === "test" ? 5434 : 5432,
            username: "root",
            password: "p@ssw0rd",
            database: process.env.NODE_ENV === "test" ? "db_test" : "db",
            entities: [
                `${__dirname}/database/entities/*.ts`
            ],
            synchronize: true,
            logging: process.env.NODE_ENV !== "test"
        }).then(async (connection: Connection) => {
            console.log("Connexion établie");

            // Create a new table entry using classic class creation
            // The constructor can also be used for this
            /*
            const user: UserEntity = new UserEntity();
            user.firstname = 'Lucas';
            user.lastname = 'Pointurier';
            user.address = "7 rue maurice grandcoing 94200 Ivry sur seine";
            user.pseudo = "pointu_l";
            */

            /*   user.hash = 'toto';
               user.salt = 'tata';
           */
            /*
            getRepository(UserEntity).save(user).then(() => {
                console.log("User created !");
            });
            */

            // Create new table entry using clasic JSON
            // Here we just create a sample json, then we pass it as object to
            // type##Repository create method that return UserEntity | UserEntity[]
            /*
            const jsonUser: string = JSON.stringify({
                firstname: 'Lucas2',
                lastname: 'Pointurier2',
                hash: 'test',
                salt: 'testo',
            }, null, 4);
            
            const secondUserEntity: UserEntity | UserEntity[] = getRepository(UserEntity).create(JSON.parse(jsonUser));
            getRepository(UserEntity).save(secondUserEntity);
            */
            // So while we receive ISO json, we can insert it in db with two lines of code !

            const spellRepository = getRepository(SpellEntity);

            const tab = await spellRepository.find({
                where: {
                    name: "hit"
                }
            });
            if (tab.length == 0) {
                const s1 = new SpellEntity();
                s1.name = "hit";
                s1.formula = "{c.damage} * 1.2 - {o.resistance}";
                await spellRepository.save(s1);
            }

            const tab2 = await spellRepository.find({
                where: {
                    name: "shield"
                }
            });
            if (tab2.length == 0) {
                const s2 = new SpellEntity();
                s2.name = "shield";
                s2.formula = "{c.resistance} + 10";
                await spellRepository.save(s2);
            }

            const tab3 = await spellRepository.find({
                where: {
                    name: "health"
                }
            });
            if (tab3.length == 0) {
                const s3 = new SpellEntity();
                s3.name = "health";
                s3.formula = "{c.health}";
                await spellRepository.save(s3);
            }

            const apiServer = new ApiServer();

            await apiServer.start();
            const graceful = async () => {
                await apiServer.stop();
                process.exit(0);
            };

            process.on('SIGTERM', graceful);
            process.on('SIGINT', graceful);
            resolve(apiServer);
        }).catch((error: Error) => {
            console.dir(error);
            fs.appendFileSync('./log.txt', `Error ${JSON.stringify(error)}\n`);
        });
    });
}
