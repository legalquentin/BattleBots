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
let Workers: IWorkerMeta[] = [];

interface IWorkerMeta {
    secret: string;
    token: string;
    process: cp.ChildProcess;
    url: string;
    gameId: number;
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
            const port = "443";// this.config.getWorkerPort();
            const p = await new Promise(async rslv => {
                const WORKER_PATH = `${this.config.getWorkerDir()}/main.go`; // '/home/quentin/go/src/TIC-GPE5/Worker';
                game.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                let secret = "";
                if (Workers.length < 1) {
                    secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    const child = cp.spawn('go', ['run', WORKER_PATH, secret], { stdio: [process.stdin, process.stdout, process.stderr] });
                    Workers.push({ gameId: game.id, process: child, url: addr + ":" + port, secret: secret, token: game.token});
                    // give 3 sec to start the worker
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else {
                    secret = Workers[0].secret;
                    // TODO impl a new way of using the workers
                    Workers.push({ gameId: game.id, process: Workers[0].process, url: addr + ":" + port, secret: Workers[0].secret, token: game.token });
                }
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
                }, (err, res, body) => {
                    console.log(body);
                    console.log("###### Game Created #######");
                    rslv({  secret: secret, token: game.token, err: err, res: res});
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
        const meta: IWorkerMeta = Workers[0];
        if (meta) {
            kill(meta.process.pid);
            Workers = null;
            console.log('KILLED');
            return true;
        }
        return false;
    }

    private async callWorkerJoin(gameId, playerId, worker) {
        return await new Promise(resolve => {
            request({
                agentOptions: { rejectUnauthorized: false },
                body: {
                    gameId: "" + gameId,
                    playerId: "" + playerId,
                },
                headers: {
                    'x-api-key': worker.secret
                },
                json: true,
                method: "POST",
                strictSSL: false,
                url: "https://" + worker.url + "/api/game/join",
            }, (err, res, body) => {
                console.log("###### Game Join end #######");
                console.log(err, body);
                resolve(body);
            });
        });
    }

    public async joinGame(battleId: number, playerId: number) {
        const gameMeta = Workers.find(item => item.gameId == battleId);
        if (!gameMeta) {
            console.log('[ERROR](JOIN)', 'lost handle on worker process... do $> pkill Worker');
            return (new SendResource<HttpResponseModel<any>>("BattleController", 404, {
                data: null,
                httpCode: 404,
                message: `Game instance could not be found, contact an administrator`
            }));
        } else {
            let r = await this.callWorkerJoin(battleId, playerId, gameMeta)
            console.log("########################");
            console.log(r);
            return (new SendResource<HttpResponseModel<any>>("BattleController", 200, {
                data: {game: r, token: gameMeta.token},
                httpCode: 200,
                message: "ok"
            }));

            // return new SendResource<HttpResponseModel<any>>("BattleController", 200, {
            //     data: { url: gameMeta.url },
            //     httpCode: 200,
            //     message: `game instance address`
            // });
        }
    }

    private async callWorkerDelete(meta: IWorkerMeta) {
        return await new Promise(resolve => {
            request({
                agentOptions: { rejectUnauthorized: false },
                headers: {
                    'x-api-key': meta.secret
                },
                json: true,
                method: "DELETE",
                strictSSL: false,
                url: "https://" + meta.url + "/api/game/delete/" + meta.gameId,
            }, (err, res, body) => {
                console.log("###### Game Join end #######");
                console.log(err, body);
                resolve(body);
            });
        });
    }

    public async deleteGame(battleId: number) {
        const gameMeta = Workers.find(item => item.gameId == battleId);
        if (!gameMeta) {
            return
        } else {
            // !! IMPORTANT
            // I choose to remove the child process of the go api when we remove all game instance in the node api 
            // so we can make live change to the go source code and restart it whil  node still run
            // IT SHOULD CHANGE, as of many things tho, like we should build a go exec in the end anyway...
            if (Workers.length == 1) {
                this.killGoWorker();
                Workers = [];
            } else {
                await this.callWorkerDelete(gameMeta);
                return
            }
        }
    }
}