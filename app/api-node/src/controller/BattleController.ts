import { getRepository, Repository } from "typeorm";
import { DELETE, GET, Path, PathParam, POST, Security } from "typescript-rest";
import { SendResource } from "../../lib/ReturnExtended";
import { BattleEntity } from "../database/entities/BattleEntity";
import { SpellEntity } from "../database/entities/SpellEntity";
import UserBattleEntity from "../database/entities/UserBattleEntity";
import IBattleJoin from "../http-models/IBattleJoin";
import IBattleResource from "../http-models/IBattleResource";
import IResourceId from "../http-models/IResourceId";
import Response from "../http-models/Response";
import BattleEntityAsm from "../service/BattleEntityAsm";
import BattleWorkerService from '../service/BattleWorkerService';
import { battleResourceDecoder, battleJoinDecoder } from "../service/Validation";
import UserEntity from '../database/entities/UserEntity';
import UserBattleEntityAsm from '../service/UserBattleEntityAsm';

@Path("/battle")
export default class BattleController {
    public repository: Repository<BattleEntity>;
    public userBattleRepository: Repository<UserBattleEntity>;
    public userRepository: Repository<UserEntity>;
    public spellRepository: Repository<SpellEntity>;
    public asm: BattleEntityAsm;
    public userBattleEntityAsm: UserBattleEntityAsm;
    public battleWorkerService: BattleWorkerService;

    constructor() {
        this.repository = getRepository(BattleEntity);
        this.userBattleRepository = getRepository(UserBattleEntity);
        this.spellRepository = getRepository(SpellEntity);
        this.userRepository = getRepository(UserEntity);
        this.battleWorkerService = new BattleWorkerService();
        this.asm = new BattleEntityAsm();
        this.userBattleEntityAsm = new UserBattleEntityAsm();
    }

    /**
     * Handler to create a new game
     * TODO: instaciate a new go worker, take control of the bots, make an handshake,
     * establish the sockets, etc... @quentin @thomas
     * @param battle
     */
    @Path("/")
    @POST
    @Security("ROLE_USER")
    public register(battle: IBattleResource): Promise<SendResource<Response<IResourceId>>> {
        const entity = this.asm.toEntity(battle);

        return new Promise<SendResource<Response<IResourceId>>>(async (end) => {
            let ret = null;
            const response: Response<IResourceId> = {
                data: null,
                httpCode: 201,
                message: "Battle created"
            };
            try {
                battleResourceDecoder.runWithException(battle);
            }
            catch (e) {
                response.httpCode = 400;
                response.message = e.message;
                return end(new SendResource<Response<IResourceId>>("BattleController", response.httpCode, response));
            }
            try {
                ret = await this.repository.save(entity);
            }
            catch (e) {
                response.httpCode = 400;
                response.message = "Failed to created battle";
            }
            if (ret) {
                const resource: IResourceId = {
                    id: ret.id
                };
                response.data = resource;
                battle.id = ret.id;
                this.battleWorkerService.startGoWorker(battle).then(r => {
                    console.log('CTRL', r);
                    response.message = JSON.stringify(r);
                    end(new SendResource<Response<IResourceId>>("BattleController", response.httpCode, response));
                });
            } else {
                end(new SendResource<Response<IResourceId>>("BattleController", response.httpCode, response));
            }
        });
    }

    /**
     * return all running games instances
     */
    @Path("/")
    @GET
    @Security("ROLE_USER")
    public list(): Promise<SendResource<Response<Array<IBattleResource>>>> {
        return new Promise<SendResource<Response<Array<IBattleResource>>>>(async (end) => {
            const list = await this.repository.find();
            const resources = this.asm.toResources(list);
            const response: Response<Array<IBattleResource>> = {
                data: resources,
                httpCode: 200,
                message: "list battle"
            };

            end(new SendResource<Response<Array<IBattleResource>>>("BattleController", response.httpCode, response));
        });
    }

    /**
     * Allow user to join an already created game:
     * - It searches in battlerepository for battle with id: battleId; and then create a UserBattleEntity 
     * and save it in db.
     * - It find the child process in BattleWorkerService and redirect the request to the go worker,
     *  in order to establish socket connexion
     * 
     * @param battleId
     * @param userGameId
     */
    @Path("/join")
    @POST
    @Security("ROLE_USER")
    public async join(battleJoin: IBattleJoin): Promise<SendResource<Response<IResourceId>>> {
        return new Promise<SendResource<Response<any>>>(async (end) => {
            try {
                battleJoinDecoder.runWithException(battleJoin);
                const battleEntity = await this.repository.findOne(battleJoin.battleId);
                if (battleEntity == null) {
                    end(new SendResource<Response<any>>("BattleController", 404, {
                        httpCode: 404,
                        message: `Battle not found`,
                        data: null
                    }));
                }

                const user: UserEntity = await this.userRepository.findOne(battleJoin.userId);
                const entity = this.userBattleEntityAsm.toEntity(user, battleEntity);
                let userEntity = await this.userBattleRepository.findOne({ where: { user: entity.user } });

                //TODO: Check if game has available slots for new players
                if (userEntity != null) {
                    // player aready joined, just return him the worker endpoint address
                    end(this.battleWorkerService.joinGame(battleJoin.battleId.toString()));
                } else {
                    userEntity = await this.userBattleRepository.save(entity);
                }

                // find the coressponding worker and get the redirection
                end(this.battleWorkerService.joinGame(battleJoin.battleId.toString()));

                // TODO: AND WHY THE FUCK I CANNOT DO THAT ???
                // end(new SendResource<Response<any>>("BattleController", 302, {
                //     Location: url
                // }))
            } catch (e) {
                const response: Response<IResourceId> = {
                    data: null,
                    httpCode: 400,
                    message: e.message
                };
                end(new SendResource<Response<IResourceId>>("BattleController", response.httpCode, response));
            }
        });
    }

    /**
     * TODO: Return http address of videos hosted somewhere
     * currently it returns game stats (hp, energy, ....)
     * @param battleId
     */
    // @Path("/watch/:battleId")
    // @GET
    // @Security("ROLE_USER")
    // public watch(@PathParam("battleId") battleId: number): Promise<SendResource<Response<Array<IUserGameResource>>>> {
    //     return new Promise<SendResource<Response<Array<IUserGameResource>>>>(async (end) => {
    //         const battleEntity = await this.repository.findOne(battleId);
    //         const userBattlesEntities = await this.userBattleRepository.find({
    //             where: {
    //                 battle: battleEntity
    //             }
    //         });
    //         const userGames = userBattlesEntities.map(userBattleEntity => userBattleEntity.userGame);
    //         const resources = this.userGameAsm.toResources(userGames);

    //         end(new SendResource<Response<Array<IUserGameResource>>>("BattleController", 200, {
    //             httpCode: 200,
    //             message: "watch battle",
    //             data: resources
    //         }));
    //     });
    // }

    @DELETE
    @Path("/:battleId")
    @Security("ROLE_USER")
    public delete(@PathParam("battleId") battleId: number) {
        return new Promise<SendResource<Response<any>>>(async (end) => {
            const battle = await this.repository.findOne(battleId);

            if (battle) {
                // remove foreign keys 
                await this.userBattleRepository.remove(battle.userBattles);
                await this.repository.remove(battle);

                this.battleWorkerService.killGoWorker();
                end(new SendResource<Response<any>>("BattleController", 200, {
                    httpCode: 200,
                    message: "delete battle",
                    data: "OK"
                }));
            }
            else {
                end(new SendResource<Response<any>>("BattleController", 200, {
                    httpCode: 404,
                    message: "battle not found",
                    data: null
                }));
            }
        });
    }
}