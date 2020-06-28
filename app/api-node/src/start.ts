'use strict';
import { ApiServer } from './api-server';
import "reflect-metadata";
import { Connection, createConnection } from 'typeorm';
import * as fs from "fs";
import { connectionName } from "../src/service/util/connectionName"; 
import { ApiServerFactory } from './api-server-factory';

export async function start(): Promise<ApiServer> {

    return new Promise((resolve, reject) => {
        createConnection(connectionName()).then(async (connection: Connection) => {
            const factory = new ApiServerFactory();
            const apiServer = factory.getServer();

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
