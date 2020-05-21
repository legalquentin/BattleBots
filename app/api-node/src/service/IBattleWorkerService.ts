import { IGameResource } from "../resources/IGameResource";

export default abstract class IBattleWorkerService {
    abstract startGoWorker(game: IGameResource);
    abstract killGoWorker(): boolean;
    abstract joinGame(battleId: string, playerId: string);
};
