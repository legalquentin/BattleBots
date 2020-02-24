import { IGameResource } from "../http-models/IGameResource";
import { SendResource } from "../../lib/ReturnExtended";
import Response from "../http-models/Response";

export default abstract class IBattleWorkerService {
    abstract startGoWorker(game: IGameResource);
    abstract killGoWorker(): boolean;
    abstract joinGame(battleId: string) : SendResource<Response<any>>;
};
