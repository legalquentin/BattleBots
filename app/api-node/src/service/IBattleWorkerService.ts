import { IGameResource } from "../resources/IGameResource";
import { SendResource } from "../../lib/ReturnExtended";
import HttpResponseModel from "../resources/HttpResponseModel";

export default abstract class IBattleWorkerService {
    abstract startGoWorker(game: IGameResource);
    abstract killGoWorker(): boolean;
    abstract joinGame(battleId: string, playerId: string) : SendResource<HttpResponseModel<any>>;
};
