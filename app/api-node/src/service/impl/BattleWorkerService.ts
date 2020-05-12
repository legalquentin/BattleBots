/**
 * This service will be used to handle go worker instanciation, administration and such
 * feel free to provide a better implementation for the following fnction if you feel 
 * they do not correspond to the project structure defined by @thomas and @lucas
 * 
 * Author @quentin
 */
import * as cp from 'child_process';
import { SendResource } from '../../../lib/ReturnExtended';
import HttpResponseModel from "../../resources/HttpResponseModel";
import * as request from 'request';
import * as kill from 'tree-kill';
import { IGameResource } from "../../resources/IGameResource";
import { Singleton, Inject } from 'typescript-ioc';
import IBattleWorkerService from '../IBattleWorkerService';
import IConfig from '../IConfig';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
let Workers: IWorkerMeta = null;

interface IWorkerMeta {
    key: string;
    process: cp.ChildProcess;
    url: string;
}

@Singleton
export default class BattleWorkerService implements IBattleWorkerService {
    // Workers hold ref to all running games


    @Inject
    private config: IConfig;

    /**
     * startGoWorker will start a go process on the server add it to the listof  "WorkerProcesses"
     */
    public async startGoWorker(game: IGameResource) {
        try {
            const addr = this.config.getWorkerAddress();
            const port = this.config.getWorkerPort();
            const p = await new Promise(async rslv => {
                const WORKER_PATH = `${this.config.getWorkerDir()}/main.go`; // '/home/quentin/go/src/TIC-GPE5/Worker';
                const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                if (Workers == null) {
                    const child = cp.spawn('go', ['run', WORKER_PATH, secret], { stdio: [process.stdin, process.stdout, process.stderr] });
                    Workers = { process: child, url: addr + ":" + port, key: secret };
                    // give 3 sec to start the worker
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
                game.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                request({
                    agentOptions: { rejectUnauthorized: false },
                    body: {
                        id: game.id,
                        name: game.name,
                        token: game.token
                    },
                    headers: {
                        'x-api-key': secret
                    },
                    json: true,
                    method: "POST",
                    strictSSL: false,
                    url: `https://${addr}:${port}/api/game/create`
                }, (err, res) => {
                    console.log("#################################");
                    console.log(err, res);
                    rslv({ token: game.token, secret: secret });
                });
            });
            return p;
        } catch (e) {
            console.log(e);
            return {
                err: JSON.stringify(e)
            }
        }
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

    public joinGame(battleId: string): SendResource<HttpResponseModel<any>> {
        const gameMeta = Workers[battleId];
        if (typeof gameMeta === 'undefined') {
            console.log('[ERROR](JOIN)', 'lost handle on worker process... do $> pkill Worker');
            return (new SendResource<HttpResponseModel<any>>("BattleController", 404, {
                data: null,
                httpCode: 404,
                message: `Game instance could not be found, contact an administrator`
            }));
        } else {
            return new SendResource<HttpResponseModel<any>>("BattleController", 200, {
                data: { url: gameMeta.url },
                httpCode: 200,
                message: `game instance address`
            });
        }
    }
}