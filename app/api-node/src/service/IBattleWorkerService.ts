import { IGameResource } from "../resources/IGameResource";

export default abstract class IBattleWorkerService {
    abstract startGoWorker(game: IGameResource);
    abstract killGoWorker(): boolean;
    abstract joinGame(battleId: number, playerId: number, botId: number);
    abstract deleteGame(battleId: number);
};
