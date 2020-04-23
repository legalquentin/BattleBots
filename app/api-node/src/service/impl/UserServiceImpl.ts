import { UserService } from "../UserService";
import UserEntity from "../../../src/database/entities/UserEntity";
import * as _ from "lodash";
import IServiceFactory from "../IServiceFactory";
import { Singleton, Inject } from "typescript-ioc";
import { hashSync } from "bcrypt";
import IConfig from "../IConfig";

@Singleton
export class UserServiceImpl implements UserService {

    @Inject
    factory: IServiceFactory;

    @Inject
    config: IConfig;

    public async saveOrUpdate(user: UserEntity): Promise<UserEntity>{
            try {
                if (user.id)
                {
                    await this.factory.getUserRepository().update(user.id, user);
                    return (user);
                }
                else {
                    user.hash = hashSync(user.hash, this.config.genSalt());

                    const saved : UserEntity = await this.factory.getUserRepository().save(user);
                    return (saved);
                }

            }
            catch (e){
                throw e;
            }            
    }

    public async findAll(): Promise<Array<UserEntity>>{
        return (this.factory.getUserRepository().find());
    }

    public async deleteOne(id: number) : Promise<Boolean>{
        try {
            const user = await this.factory.getUserRepository().findOne(id);

            if (user){
                await this.factory.getUserRepository().delete(user.id)
                return (true);
            }
            return (false);
        } catch (e){
            return (false);
        }
    }

    public async findOne(id: number) : Promise<UserEntity>{
        return (this.factory.getUserRepository().findOne(id));
    }
}
