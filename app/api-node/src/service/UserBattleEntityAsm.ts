import UserBattleEntity from '../database/entities/UserBattleEntity';
import IBattleJoin from '../http-models/IBattleJoin';
import { BattleEntity } from '../database/entities/BattleEntity';
import UserEntity from '../database/entities/UserEntity';
import UserEntityAsm from './UserEntityAsm';
import BattleEntityAsm from './BattleEntityAsm';

export default class UserBattleEntityAsm {
    private ueAsm: UserEntityAsm;
    private beAsm: BattleEntityAsm;
    
    public UserBattleEntityAsm(
        ueAsm: UserEntityAsm,
        beAsm: BattleEntityAsm 
    ) {}

    public toEntity(user: UserEntity, battle: BattleEntity) : UserBattleEntity{

        const ub = new UserBattleEntity();
        // ub.user = this.ueAsm.toEntity(user);
        ub.user =user;
        // ub.battle = this.beAsm.toEntity(battle);
        ub.battle = battle;
        ub.createdAt = new Date();
        return (ub);
    }

    public toResource(ub : UserBattleEntity) : IBattleJoin{
        const resource : IBattleJoin = {
            battle: this.beAsm.toResource(ub.battle),
            user:   this.ueAsm.toResource(ub.user)
        };

        return (resource);
    }

    public toResources(ubs: Array<UserBattleEntity>) : Array<IBattleJoin>{
        const tab = ubs.map(ub => this.toResource(ub));
        return (tab);
    }
}