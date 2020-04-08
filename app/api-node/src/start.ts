'use strict';
import { ApiServer } from './api-server';
import "reflect-metadata";
import { Connection, createConnection } from 'typeorm';
import * as fs from "fs";
import * as config from "config";


export async function start(): Promise<ApiServer> {

    // const mongoConnector = new MongoConnector();
    // TODO : Create config files (db settings and entities declarations)
    return new Promise((resolve, reject) => {
        createConnection({
            name: config.get('env').toString(),
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "root",
            password: "p@ssw0rd",
            database: "db",
            entities: [
                `${__dirname}/database/entities/**/*.ts`
            ],
          //  logging: true
        }).then(async (connection: Connection) => {        
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
