import UserEntity from "../database/entities/UserEntity";

export abstract class UserService {
    public async abstract saveOrUpdate(user: UserEntity): Promise<UserEntity>;
    public async abstract findAll(): Promise<Array<UserEntity>>;
    public async abstract deleteOne(id: number) : Promise<Boolean>;
    public async abstract findOne(id: number) : Promise<UserEntity>;
}
