//import IBattleResource from './IBattleResource';
import IUserResource from './IUserResource';

export default interface IBattleJoin {
    //battle?: IBattleResource;
    battleId?: number;
    user?: IUserResource;
    userId?: number;
}