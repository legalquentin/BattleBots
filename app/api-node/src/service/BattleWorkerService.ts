/**
 * This service will be used to handle go worker instanciation, administration and such
 * feel free to provide a better implementation for the following fnction if you feel 
 * they do not correspond to the project structure defined by @thomas and @lucas
 * 
 * Author @quentin
 */
import * as cp from 'child_process';
import { SendResource } from '../../lib/ReturnExtended';
import Response from "../http-models/Response";
import * as request from 'request';
import * as kill from 'tree-kill';
import IBattleResource from '../http-models/IBattleResource';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
let Workers: IWorkerMeta = null;

interface IWorkerMeta {
    key: string;
    process: cp.ChildProcess;
    url: string;
}

export default class BattleWorkerService {
    // Workers hold ref to all running games


    /**
     * startGoWorker will start a go process on the server add it to the listof  "WorkerProcesses"
     */
    public async startGoWorker(battle: IBattleResource) {
        const p = await new Promise(async rslv => {
            const WORKER_PATH = '/Users/quentin/D.PERS/BattleBots/app/api-go/main.go'; // '/home/quentin/go/src/TIC-GPE5/Worker';
            const secret =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            if (Workers == null) {
                const child = cp.spawn('go', ['run', WORKER_PATH, secret], { stdio: [process.stdin, process.stdout, process.stderr] });
                Workers = {process: child, url: "127.0.0.1:1234", key: secret};
                // give 3 sec to start the worker
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            battle.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            request({
                agentOptions: { rejectUnauthorized: false},
                body: battle,
                headers: {
                    'x-api-key': secret
                },
                json: true,
                method: "POST",
                strictSSL: false,
                url: "https://127.0.0.1:443/api/game/create"
            },  (error, response, body) => {
                console.log("#################################");
                console.log(response, body);
                rslv({token: battle.token, secret: secret});
            });
        });        
        return p;
    }

    // kill package from tree-kill kill all suprocess started from one
    public killGoWorker(): boolean {
        const meta: IWorkerMeta = Workers;
        if (meta) {
            kill(meta.process.pid);
            Workers = null;
            console.log('KILLED');
            return true;
        }
        return false;
    }

    public joinGame(battleId: string): SendResource<Response<any>> {
        const gameMeta = Workers[battleId];
        if (typeof gameMeta === 'undefined') {
            console.log('[ERROR](JOIN)', 'lost handle on worker process... do $> pkill Worker');
            return (new SendResource<Response<any>>("BattleController", 404, {
                data:null,
                httpCode: 404,
                message: `Game instance could not be found, contact an administrator`
            }));
        } else {
            return new SendResource<Response<any>>("BattleController", 200, {
                data: {url: gameMeta.url},
                httpCode: 200,
                message: `game instance address`
            });
        }
    }
}