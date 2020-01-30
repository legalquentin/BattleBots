import { start } from './start';
import * as fs from "fs";

start()
    .catch((err) => {
        // tslint:disable-next-line:no-console
        
        fs.appendFileSync('./log.txt', "Error: " + err.message + "\n");
        console.error(`Error starting server: ${err.message}`);
        process.exit(-1);
    });
