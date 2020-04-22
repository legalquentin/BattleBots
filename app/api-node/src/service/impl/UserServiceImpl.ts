import { UserService } from "../UserService";
import UserEntity from "../../../src/database/entities/UserEntity";
import * as _ from "lodash";
import IServiceFactory from "../IServiceFactory";
import { Singleton, Inject } from "typescript-ioc";

@Singleton
export class UserServiceImpl implements UserService {

    @Inject
    factory: IServiceFactory;

    public async saveOrUpdate(user: UserEntity): Promise<UserEntity>{
        if (user.id){
            try {
                const toFind = await this.factory.getUserRepository().findOne(user.id);

                toFind.address = user.address;
                toFind.email = user.email;
                toFind.firstname = user.firstname;
                toFind.lastname = user.lastname;
                toFind.pseudo = user.pseudo;
                toFind.hash = user.hash;
                await this.factory.getUserRepository().update(toFind.id, toFind);
                return (toFind);
            }
            catch (e){
                return Promise.reject(null);
            }            
        }
        else {
            const saved : UserEntity = await this.factory.getUserRepository().save(user);
            return (saved);
        }
    }

    public async findAll(): Promise<Array<UserEntity>>{
        return (this.factory.getUserRepository().find());
    }

    public async deleteOne(id: number) : Promise<Boolean>{
        try {
            const user = await this.factory.getUserRepository().findOne(id);

            if (user){
                await this.factory.getUserRepository().delete(user);
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