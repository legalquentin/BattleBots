import { IGameResource } from "../resources/IGameResource";
import { SendResource } from "../../lib/ReturnExtended";
import Response from "../resources/Response";

export default abstract class IBattleWorkerService {
    abstract startGoWorker(game: IGameResource);
    abstract killGoWorker(): boolean;
    abstract joinGame(battleId: string) : SendResource<Response<any>>;
};
